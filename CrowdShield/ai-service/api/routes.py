from fastapi import APIRouter, File, HTTPException, UploadFile, status

from config.settings import settings
from models.schemas import (
    AlertItemSchema,
    BehaviourAnalysisMetadata,
    CrowdDensityMetadata,
    ErrorResponse,
    FrameExtractionMetadata,
    HealthResponse,
    HeatmapMetadata,
    PersonDetectionMetadata,
    RiskAssessmentMetadataSchema,
    RootResponse,
    TrackingMetadata,
    UploadErrorResponse,
    UploadInfo,
    VideoUploadResponse,
)
from recommendation.recommendation_engine import IntelligentRecommendationEngine
from risk.alert_generator import AlertGenerator
from risk.risk_assessor import UnifiedRiskAssessor
from tracking.behaviour_detector import BehaviourDetector
from tracking.crowd_density import CrowdDensityEstimator
from tracking.frame_extractor import FrameExtractor
from tracking.heatmap_generator import HeatmapGenerator
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
            "description": "Unexpected internal server error during pipeline processing"
        }
    },
    status_code=status.HTTP_200_OK,
    summary="Upload Video and Run Unified CrowdShield AI Report Pipeline"
)
async def upload_video(file: UploadFile = File(...)) -> VideoUploadResponse:
    """Accept, validate, and save an uploaded video file, extract frames, detect persons, track objects, estimate crowd density, generate heatmaps, detect suspicious behavior, evaluate risk, generate recommendations, trigger alerts, and return a unified AI report."""
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

    try:
        density_estimator = CrowdDensityEstimator()
        density_result = density_estimator.estimate_density_from_tracks(tracking_result)
        logger.info(
            f"Crowd density estimation complete for '{saved_path.name}': "
            f"highest density={density_result['highest_density']}, avg={density_result['average_people']} people"
        )
    except Exception as exc:
        logger.error(f"Crowd density estimation failed for uploaded video '{saved_path.name}': {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Tracking complete, but crowd density estimation failed."
        )

    try:
        heatmap_gen = HeatmapGenerator()
        heatmap_result = heatmap_gen.generate_heatmaps_from_tracks(
            frames_dir=extraction_result["frames_directory"],
            tracking_result=tracking_result
        )
        logger.info(
            f"Crowd heatmap generation complete for '{saved_path.name}': "
            f"{heatmap_result['generated_frames']} heatmap frames generated"
        )
    except Exception as exc:
        logger.error(f"Crowd heatmap generation failed for uploaded video '{saved_path.name}': {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Crowd density complete, but heatmap generation failed."
        )

    try:
        behaviour_detector = BehaviourDetector()
        behaviour_result = behaviour_detector.analyze_behaviour(
            tracking_result=tracking_result,
            crowd_density_result=density_result
        )
        logger.info(
            f"Suspicious behaviour detection complete for '{saved_path.name}': "
            f"overall behaviour='{behaviour_result['overall_behaviour']}', max risk={behaviour_result['max_risk_score']}"
        )
    except Exception as exc:
        logger.error(f"Suspicious behaviour detection failed for uploaded video '{saved_path.name}': {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Heatmap generation complete, but suspicious behaviour detection failed."
        )

    try:
        risk_assessor = UnifiedRiskAssessor()
        risk_result = risk_assessor.evaluate_risk(
            detection_result=detection_result,
            tracking_result=tracking_result,
            density_result=density_result,
            behaviour_result=behaviour_result
        )
        logger.info(
            f"Unified risk assessment complete for '{saved_path.name}': "
            f"overall risk='{risk_result['overall_risk']}', score={risk_result['risk_score']}"
        )
    except Exception as exc:
        logger.error(f"Unified risk assessment failed for uploaded video '{saved_path.name}': {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Behaviour detection complete, but unified risk assessment failed."
        )

    try:
        rec_engine = IntelligentRecommendationEngine()
        recommendation_result = rec_engine.generate_recommendations(risk_assessment_result=risk_result)
        logger.info(
            f"Intelligent recommendations generated for '{saved_path.name}': "
            f"{len(recommendation_result['recommendations'])} recommendation(s)"
        )
    except Exception as exc:
        logger.error(f"Recommendation generation failed for uploaded video '{saved_path.name}': {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Risk assessment complete, but recommendation generation failed."
        )

    try:
        alert_gen = AlertGenerator()
        alert_result = alert_gen.generate_alerts(
            risk_assessment=risk_result,
            recommendations=recommendation_result,
            behaviour_analysis=behaviour_result
        )
        logger.info(
            f"Alert generation complete for '{saved_path.name}': "
            f"{alert_result['total_alerts']} alert(s) generated"
        )
    except Exception as exc:
        logger.error(f"Alert generation failed for uploaded video '{saved_path.name}': {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Recommendation generation complete, but alert generation failed."
        )

    heatmap_meta = HeatmapMetadata(**heatmap_result)
    raw_alerts = alert_result.get("alerts", [])

    return VideoUploadResponse(
        message="Video uploaded and processed successfully",
        upload=UploadInfo(
            filename=saved_path.name,
            content_type=file.content_type or "application/octet-stream",
            file_size=file_size
        ),
        frame_extraction=FrameExtractionMetadata(**extraction_result),
        person_detection=PersonDetectionMetadata(**detection_result),
        tracking=TrackingMetadata(**tracking_result),
        crowd_density=CrowdDensityMetadata(**density_result),
        heatmaps=heatmap_meta,
        heatmap=heatmap_meta,
        behaviour_analysis=BehaviourAnalysisMetadata(**behaviour_result),
        risk_assessment=RiskAssessmentMetadataSchema(**risk_result),
        recommendations=recommendation_result.get("recommendations", []),
        alerts=[AlertItemSchema(**a) for a in raw_alerts]
    )
