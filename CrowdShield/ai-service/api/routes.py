from fastapi import APIRouter, File, HTTPException, UploadFile, status

from config.settings import settings
from models.schemas import (
    ErrorResponse,
    HealthResponse,
    RootResponse,
    UploadErrorResponse,
    VideoUploadResponse,
)
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
            "description": "Unexpected internal server error"
        }
    },
    status_code=status.HTTP_200_OK,
    summary="Upload Video File"
)
async def upload_video(file: UploadFile = File(...)) -> VideoUploadResponse:
    """Accept, validate, and save an uploaded video file."""
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

        return VideoUploadResponse(
            message="Video uploaded successfully",
            filename=saved_path.name,
            content_type=file.content_type or "application/octet-stream",
            file_size=file_size
        )
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Unexpected failure while processing video upload for '{file.filename}': {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process video upload due to an internal server error."
        )
