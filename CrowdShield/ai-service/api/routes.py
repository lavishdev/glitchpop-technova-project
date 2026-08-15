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
    IncidentReportSchema,
    PersonDetectionMetadata,
    RiskAssessmentMetadataSchema,
    RootResponse,
    TrackingMetadata,
    UploadInfo,
    VideoUploadResponse,
    ChatRequest,
    ChatResponse,
    CrowdSimulationSchema,
    SimulationMinuteProjection,
)
from recommendation.recommendation_engine import IntelligentRecommendationEngine
from reporting.gemini_integration import GeminiAnalyzer
from reporting.incident_report import IncidentReportGenerator
from reporting.pdf_report import PDFReportGenerator
from risk.alert_generator import AlertGenerator
from risk.risk_assessor import UnifiedRiskAssessor
from simulation import RuleBasedSimulator
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
            "model": ErrorResponse,
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
    """Accept, validate, and save an uploaded video file, extract frames, detect persons, track objects, estimate crowd density, generate heatmaps, detect suspicious behavior, evaluate risk, generate recommendations, trigger alerts, and synthesize an incident report."""
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

    try:
        simulator = RuleBasedSimulator()
        simulation_result = simulator.simulate(
            tracking_result=tracking_result,
            density_result=density_result,
            risk_result=risk_result,
            behaviour_result=behaviour_result
        )
        logger.info(f"Rule-based crowd simulation complete for '{saved_path.name}'")
    except Exception as exc:
        logger.error(f"Rule-based crowd simulation failed for uploaded video '{saved_path.name}': {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Alert generation complete, but crowd simulation failed."
        )

    upload_info_dict = {
        "filename": saved_path.name,
        "content_type": file.content_type or "application/octet-stream",
        "file_size": file_size
    }

    try:
        report_gen = IncidentReportGenerator()
        report_result = report_gen.generate_report(
            upload_info=upload_info_dict,
            extraction_result=extraction_result,
            detection_result=detection_result,
            tracking_result=tracking_result,
            density_result=density_result,
            behaviour_result=behaviour_result,
            risk_result=risk_result,
            recommendation_result=recommendation_result,
            alert_result=alert_result
        )
        logger.info(f"Incident report synthesis complete for '{saved_path.name}'")
    except Exception as exc:
        logger.error(f"Incident report synthesis failed for uploaded video '{saved_path.name}': {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Alert generation complete, but incident report synthesis failed."
        )

    try:
        gemini_analyzer = GeminiAnalyzer()
        gemini_result = gemini_analyzer.analyze(report_result)
        logger.info(f"Gemini AI analysis complete for '{saved_path.name}'")
    except Exception as exc:
        logger.error(f"Gemini AI analysis failed for uploaded video '{saved_path.name}': {exc}", exc_info=True)
        # Fallback provided by GeminiAnalyzer on failure, no HTTP 500 raised.
        gemini_result = {
            "incident_summary": "Gemini API integration is disabled or failed.",
            "ai_recommendations": ["No AI recommendations available."],
            "multilingual_announcements": {
                "en": "No announcement available.",
                "hi": "कोई घोषणा उपलब्ध नहीं है।"
            }
        }

    pdf_path = None
    try:
        pdf_gen = PDFReportGenerator()
        pdf_path = pdf_gen.generate_pdf(
            incident_report=report_result,
            upload_info=upload_info_dict
        )
    except Exception as exc:
        logger.error(f"PDF generation failed for uploaded video '{saved_path.name}': {exc}", exc_info=True)
        # Continue processing despite PDF generation failure as per requirements
        
    heatmap_meta = HeatmapMetadata(**heatmap_result)
    raw_alerts = alert_result.get("alerts", [])

    # Convert absolute paths to web-accessible URLs
    video_name = extraction_result.get("video_name", "unknown")
    extraction_result["frames_directory"] = f"/outputs/frames/{video_name}"
    detection_result["detections_directory"] = f"/outputs/detections/{video_name}"
    heatmap_meta.heatmaps_directory = f"/outputs/heatmaps/{video_name}"
    pdf_url = f"/outputs/reports/{video_name}_report.pdf" if pdf_path else None

    pred_projections = [
        SimulationMinuteProjection(**p)
        for p in simulation_result.get("minute_by_minute_projections", [])
    ]
    simulation_meta = CrowdSimulationSchema(
        forecast_duration_minutes=simulation_result.get("forecast_duration_minutes", 5),
        predicted_crowd_movement=simulation_result.get("predicted_crowd_movement", ""),
        predicted_risk=simulation_result.get("predicted_risk", ""),
        overall_predicted_risk_level=simulation_result.get("overall_predicted_risk_level", "SAFE"),
        overall_predicted_risk_score=simulation_result.get("overall_predicted_risk_score", 0.0),
        minute_by_minute_projections=pred_projections
    )

    return VideoUploadResponse(
        message="Video uploaded and processed successfully",
        upload=UploadInfo(**upload_info_dict),
        frame_extraction=FrameExtractionMetadata(**extraction_result),
        person_detection=PersonDetectionMetadata(**detection_result),
        tracking=TrackingMetadata(**tracking_result),
        crowd_density=CrowdDensityMetadata(**density_result),
        heatmaps=heatmap_meta,
        heatmap=heatmap_meta,
        behaviour_analysis=BehaviourAnalysisMetadata(**behaviour_result),
        risk_assessment=RiskAssessmentMetadataSchema(**risk_result),
        recommendations=recommendation_result.get("recommendations", []),
        alerts=[AlertItemSchema(**a) for a in raw_alerts],
        incident_report=IncidentReportSchema(
            summary=report_result.get("summary", ""),
            overall_risk=report_result.get("overall_risk", "SAFE"),
            risk_score=report_result.get("risk_score", 0.0),
            frames_processed=report_result.get("frames_processed", 0),
            people_detected=report_result.get("people_detected", 0),
            highest_density=report_result.get("highest_density", "LOW"),
            recommendations=report_result.get("recommendations", []),
            alerts=[AlertItemSchema(**a) for a in report_result.get("alerts", [])]
        ),
        pdf_report=pdf_url,
        gemini_analysis=gemini_result,
        crowd_simulation=simulation_meta
    )


@router.post(
    "/chat",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="AI Assistant Chat"
)
async def chat(request: ChatRequest) -> ChatResponse:
    """Send a conversational query to the AI Assistant."""
    gemini_analyzer = GeminiAnalyzer()
    response_text = gemini_analyzer.chat(request.query, request.context)
    return ChatResponse(response=response_text)
