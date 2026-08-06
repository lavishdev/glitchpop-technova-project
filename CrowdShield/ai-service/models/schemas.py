from pydantic import BaseModel, Field


class RootResponse(BaseModel):
    service: str = Field(default="CrowdShield AI Service", examples=["CrowdShield AI Service"])
    version: str = Field(default="0.1.0", examples=["0.1.0"])


class HealthResponse(BaseModel):
    status: str = Field(default="healthy", examples=["healthy"])


class ErrorResponse(BaseModel):
    detail: str = Field(..., examples=["An internal server error occurred."])


class VideoUploadResponse(BaseModel):
    message: str = Field(default="Video uploaded successfully", examples=["Video uploaded successfully"])
    filename: str = Field(..., examples=["550e8400-e29b-41d4-a716-446655440000.mp4"])
    content_type: str = Field(..., examples=["video/mp4"])
    file_size: int = Field(..., examples=[1048576])


class UploadErrorResponse(BaseModel):
    detail: str = Field(..., examples=["Unsupported file type. Allowed extensions: .mp4, .avi, .mov, .mkv"])
