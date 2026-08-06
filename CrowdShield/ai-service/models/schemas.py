from pydantic import BaseModel, Field


class RootResponse(BaseModel):
    service: str = Field(default="CrowdShield AI Service", examples=["CrowdShield AI Service"])
    version: str = Field(default="0.1.0", examples=["0.1.0"])


class HealthResponse(BaseModel):
    status: str = Field(default="healthy", examples=["healthy"])


class ErrorResponse(BaseModel):
    detail: str = Field(..., examples=["An internal server error occurred."])
