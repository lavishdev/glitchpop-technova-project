from typing import List
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


class VideoUploadResponse(BaseModel):
    message: str = Field(
        default="Video uploaded and processed successfully",
        examples=["Video uploaded and processed successfully"]
    )
    upload: UploadInfo
    frame_extraction: FrameExtractionMetadata
    person_detection: PersonDetectionMetadata
    tracking: TrackingMetadata
