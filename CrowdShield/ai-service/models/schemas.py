from typing import List, Optional
from pydantic import BaseModel, Field


class RootResponse(BaseModel):
    service: str = Field(default="CrowdShield AI Service", examples=["CrowdShield AI Service"])
    version: str = Field(default="0.1.0", examples=["0.1.0"])


class HealthResponse(BaseModel):
    status: str = Field(default="healthy", examples=["healthy"])


class ErrorResponse(BaseModel):
    detail: str = Field(..., examples=["An internal server error occurred."])


class UploadErrorResponse(BaseModel):
    detail: str = Field(..., examples=["Unsupported file type. Allowed extensions: .mp4, .avi, .mov, .mkv"])


class UploadInfo(BaseModel):
    filename: str = Field(..., examples=["550e8400-e29b-41d4-a716-446655440000.mp4"])
    content_type: str = Field(..., examples=["video/mp4"])
    file_size: int = Field(..., examples=[1048576])


class FrameExtractionMetadata(BaseModel):
    video_name: str = Field(..., examples=["550e8400-e29b-41d4-a716-446655440000"])
    fps: float = Field(..., examples=[30.0])
    total_frames: int = Field(..., examples=[300])
    width: int = Field(..., examples=[1920])
    height: int = Field(..., examples=[1080])
    frames_directory: str = Field(..., examples=["C:\\path\\to\\outputs\\frames\\550e8400-e29b-41d4-a716-446655440000"])
    extracted_frames: int = Field(..., examples=[300])


class PerFrameCount(BaseModel):
    frame: str = Field(..., examples=["frame_000001.jpg"])
    count: int = Field(..., examples=[3])


class PersonDetectionMetadata(BaseModel):
    total_frames_processed: int = Field(..., examples=[300])
    frames_with_persons: int = Field(..., examples=[250])
    total_person_detections: int = Field(..., examples=[1250])
    per_frame_counts: List[PerFrameCount]
    detections_directory: str = Field(..., examples=["C:\\path\\to\\outputs\\detections\\550e8400-e29b-41d4-a716-446655440000"])


class TrackItem(BaseModel):
    frame: str = Field(..., examples=["frame_000001.jpg"])
    track_id: int = Field(..., examples=[1])
    bbox: List[int] = Field(..., examples=[[120, 84, 210, 325]])
    confidence: float = Field(..., examples=[0.91])


class TrackingMetadata(BaseModel):
    tracked_frames: int = Field(..., examples=[341])
    unique_people: int = Field(..., examples=[27])
    tracks: List[TrackItem]


class FrameDensityInfoSchema(BaseModel):
    frame: str = Field(..., examples=["frame_000001.jpg"])
    people_count: int = Field(..., examples=[18])
    density: str = Field(..., examples=["HIGH"])


class CrowdDensityMetadata(BaseModel):
    total_frames: int = Field(..., examples=[341])
    average_people: float = Field(..., examples=[17.2])
    maximum_people: int = Field(..., examples=[28])
    minimum_people: int = Field(..., examples=[2])
    highest_density: str = Field(..., examples=["HIGH"])
    frames: List[FrameDensityInfoSchema]


class HeatmapMetadata(BaseModel):
    generated_frames: int = Field(..., examples=[341])
    heatmaps_directory: str = Field(..., examples=["C:\\path\\to\\outputs\\heatmaps\\550e8400-e29b-41d4-a716-446655440000"])
    generated_files: List[str] = Field(..., examples=[["heatmap_000001.jpg", "heatmap_000002.jpg"]])


class FrameBehaviourInfoSchema(BaseModel):
    frame: str = Field(..., examples=["frame_000001.jpg"])
    behaviour_label: str = Field(..., examples=["NORMAL"])
    risk_score: float = Field(..., examples=[0.1])
    suspicious_tracks: int = Field(..., examples=[0])


class BehaviourAnalysisMetadata(BaseModel):
    total_frames_analyzed: int = Field(..., examples=[341])
    overall_behaviour: str = Field(..., examples=["NORMAL"])
    max_risk_score: float = Field(..., examples=[0.85])
    average_risk_score: float = Field(..., examples=[0.22])
    suspicious_events_count: int = Field(..., examples=[4])
    frames: List[FrameBehaviourInfoSchema]


class RiskAssessmentMetadataSchema(BaseModel):
    overall_risk: str = Field(..., examples=["HIGH"])
    risk_score: float = Field(..., examples=[0.83])
    risk_factors: List[str] = Field(..., examples=[["Peak crowd density reached HIGH level", "Detected suspicious movement events"]])


class AlertItemSchema(BaseModel):
    title: str = Field(..., examples=["Crowd Surge Detected"])
    message: str = Field(..., examples=["Immediate intervention required."])
    severity: str = Field(..., examples=["CRITICAL"])
    timestamp: str = Field(..., examples=["2026-08-07T14:02:15Z"])
    risk_score: float = Field(..., examples=[0.94])


class IncidentReportSchema(BaseModel):
    summary: str = Field(..., examples=["AI Incident Analysis completed for video."])
    overall_risk: str = Field(..., examples=["HIGH"])
    risk_score: float = Field(..., examples=[0.81])
    frames_processed: int = Field(..., examples=[300])
    people_detected: int = Field(..., examples=[1250])
    highest_density: str = Field(..., examples=["HIGH"])
    recommendations: List[str] = Field(..., examples=[["Restrict entry into high-density zone."]])
    alerts: List[AlertItemSchema]


class MultilingualAnnouncementsSchema(BaseModel):
    en: str = Field(..., examples=["Please remain calm and follow staff instructions."])
    hi: str = Field(..., examples=["कृपया शांत रहें और कर्मचारियों के निर्देशों का पालन करें।"])


class GeminiAnalysisSchema(BaseModel):
    incident_summary: str = Field(..., examples=["High density crowd detected with potential surge."])
    ai_recommendations: List[str] = Field(..., examples=[["Deploy extra security immediately."]])
    multilingual_announcements: MultilingualAnnouncementsSchema


class SimulationMinuteProjection(BaseModel):
    minute: int = Field(..., examples=[1])
    predicted_crowd_count: int = Field(..., examples=[20])
    predicted_density_level: str = Field(..., examples=["HIGH"])
    predicted_risk_level: str = Field(..., examples=["HIGH"])
    predicted_risk_score: float = Field(..., examples=[0.65])
    movement_description: str = Field(..., examples=["Projected headcount is 20 (HIGH density)."])


class CrowdSimulationSchema(BaseModel):
    forecast_duration_minutes: int = Field(default=5, examples=[5])
    predicted_crowd_movement: str = Field(..., examples=["Crowd movement classified as INFLOW_SURGE."])
    predicted_risk: str = Field(..., examples=["Predicted risk is expected to evolve from MEDIUM to HIGH."])
    overall_predicted_risk_level: str = Field(..., examples=["HIGH"])
    overall_predicted_risk_score: float = Field(..., examples=[0.65])
    minute_by_minute_projections: List[SimulationMinuteProjection]


class VideoUploadResponse(BaseModel):
    message: str = Field(
        default="Video uploaded and processed successfully",
        examples=["Video uploaded and processed successfully"]
    )
    upload: UploadInfo
    frame_extraction: FrameExtractionMetadata
    person_detection: PersonDetectionMetadata
    tracking: TrackingMetadata
    crowd_density: CrowdDensityMetadata
    heatmaps: HeatmapMetadata
    heatmap: Optional[HeatmapMetadata] = None
    behaviour_analysis: BehaviourAnalysisMetadata
    risk_assessment: RiskAssessmentMetadataSchema
    recommendations: List[str] = Field(
        ...,
        examples=[["Restrict entry into high-density zone.", "Notify control room operators immediately."]]
    )
    alerts: List[AlertItemSchema]
    incident_report: IncidentReportSchema
    pdf_report: Optional[str] = Field(default=None, examples=["outputs/reports/550e8400-e29b-41d4-a716-446655440000_report.pdf"])
    gemini_analysis: GeminiAnalysisSchema
    crowd_simulation: CrowdSimulationSchema
