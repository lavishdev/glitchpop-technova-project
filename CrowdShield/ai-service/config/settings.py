import os
import json
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    SERVICE_NAME: str = "CrowdShield AI Service"
    VERSION: str = "0.1.0"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    CORS_ORIGINS: List[str] = ["*"]

    UPLOADS_DIR: str = "uploads"
    OUTPUTS_DIR: str = "outputs"
    LOGS_DIR: str = "logs"
    LOG_LEVEL: str = "INFO"

    GEMINI_API_KEY: Union[str, None] = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except json.JSONDecodeError:
                    pass
            return [item.strip() for item in v.split(",") if item.strip()]
        return v

    def setup_directories(self) -> None:
        """Ensure required operational directories exist."""
        for directory in [self.UPLOADS_DIR, self.OUTPUTS_DIR, self.LOGS_DIR]:
            os.makedirs(directory, exist_ok=True)


settings = Settings()
