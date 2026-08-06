from fastapi import APIRouter, File, HTTPException, UploadFile, status

from config.settings import settings
from models.schemas import (
    ErrorResponse,
    FrameExtractionMetadata,
    HealthResponse,
    PersonDetectionMetadata,
    RootResponse,
    TrackingMetadata,
    UploadErrorResponse,
    UploadInfo,
    VideoUploadResponse,
)
from tracking.frame_extractor import FrameExtractor
from tracking.multi_object_tracker import MultiObjectTracker
from tracking.person_detector import PersonDetector
from utils.file_utils import is_allowed_video_extension, save_upload_file
from utils.logger import logger

router = APIRouter()


@router.get(
    "/",
    response_model=RootResponse,
    status_code=status.HTTP_200_OK,
    summary="Root Service Information"
)
async def get_root() -> RootResponse:
    """Return main service metadata and API version."""
    return RootResponse(
        service=settings.SERVICE_NAME,
        version=settings.VERSION
    )


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Health Check"
)
async def get_health() -> HealthResponse:
    """Return real-time operational health status of the AI service."""
    return HealthResponse(status="healthy")


@router.post(
    "/upload-video",
    response_model=VideoUploadResponse,
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "model": UploadErrorResponse,
            "description": "Unsupported file type or invalid upload"
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "model": ErrorResponse,
            "description": "Unexpected internal server error, extraction, detection, or tracking failure"
        }
    },
    status_code=status.HTTP_200_OK,
    summary="Upload Video, Extract Frames, Detect Persons, and Track Objects"
)
async def upload_video(file: UploadFile = File(...)) -> VideoUploadResponse:
    """Accept, validate, and save an uploaded video file, extract frames, detect persons, and run ByteTrack multi-object tracking."""
    if not file.filename or not is_allowed_video_extension(file.filename):
        logger.warning(f"Rejected video upload with unsupported extension: '{file.filename}'")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file type. Allowed extensions: .mp4, .avi, .mov, .mkv"
        )

    try:
        saved_path = await save_upload_file(file)
        file_size = saved_path.stat().st_size
        logger.info(f"Video uploaded successfully: '{saved_path.name}' ({file_size} bytes)")
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Unexpected failure while saving uploaded video '{file.filename}': {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save video upload due to an internal server error."
        )

    try:
        extractor = FrameExtractor(video_path=saved_path)
        extraction_result = extractor.extract_frames()
        logger.info(
            f"Frame extraction complete for '{saved_path.name}': "
            f"{extraction_result['extracted_frames']} frames extracted"
        )
    except Exception as exc:
        logger.error(f"Frame extraction failed for uploaded video '{saved_path.name}': {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Video uploaded successfully, but frame extraction failed."
        )

    try:
        detector = PersonDetector()
        detection_result = detector.process_frames_directory(
            frames_dir=extraction_result["frames_directory"]
        )
        logger.info(
            f"Person detection complete for '{saved_path.name}': "
            f"{detection_result['total_person_detections']} person detections across "
            f"{detection_result['frames_with_persons']}/{detection_result['total_frames_processed']} frames"
        )
    except Exception as exc:
        logger.error(f"Person detection failed for uploaded video '{saved_path.name}': {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Video uploaded and frames extracted successfully, but person detection failed."
        )

    try:
        tracker = MultiObjectTracker()
        tracking_result = tracker.process_frames_directory(
            frames_dir=extraction_result["frames_directory"]
        )
        logger.info(
            f"Multi-object tracking complete for '{saved_path.name}': "
            f"{tracking_result['unique_people']} unique people tracked across "
            f"{tracking_result['tracked_frames']} frames"
        )
    except Exception as exc:
        logger.error(f"Multi-object tracking failed for uploaded video '{saved_path.name}': {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Detection complete, but multi-object tracking failed."
        )

    return VideoUploadResponse(
        message="Video uploaded and processed successfully",
        upload=UploadInfo(
            filename=saved_path.name,
            content_type=file.content_type or "application/octet-stream",
            file_size=file_size
        ),
        frame_extraction=FrameExtractionMetadata(**extraction_result),
        person_detection=PersonDetectionMetadata(**detection_result),
        tracking=TrackingMetadata(**tracking_result)
    )
