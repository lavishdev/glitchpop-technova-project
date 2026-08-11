import uuid
from pathlib import Path
from typing import Set, Union
from fastapi import HTTPException, UploadFile, status

from config.settings import settings
from utils.logger import logger

ALLOWED_VIDEO_EXTENSIONS: Set[str] = {".mp4", ".avi", ".mov", ".mkv"}


def is_allowed_video_extension(filename: str) -> bool:
    """Validate whether an uploaded file has a supported video extension."""
    if not filename:
        return False
    clean_name = Path(filename).name
    ext = Path(clean_name).suffix.lower()
    return ext in ALLOWED_VIDEO_EXTENSIONS


def generate_unique_filename(original_filename: str) -> str:
    """Generate a unique filename using UUID4 while preserving the original file extension."""
    clean_name = Path(original_filename).name if original_filename else ""
    ext = Path(clean_name).suffix.lower() if clean_name else ""
    return f"{uuid.uuid4().hex}{ext}"


def ensure_uploads_dir_exists(target_dir: Union[str, Path] = settings.UPLOADS_DIR) -> Path:
    """Ensure the target uploads directory exists on disk."""
    path = Path(target_dir).resolve()
    path.mkdir(parents=True, exist_ok=True)
    return path


async def save_upload_file(
    upload_file: UploadFile,
    target_dir: Union[str, Path] = settings.UPLOADS_DIR
) -> Path:
    """Asynchronously save a FastAPI UploadFile into the target directory.

    Validates file extension, generates a unique filename, enforces path safety,
    saves contents in chunks, and returns the resolved Path of the saved file.
    """
    filename = upload_file.filename or ""
    if not is_allowed_video_extension(filename):
        allowed_str = ", ".join(sorted(ALLOWED_VIDEO_EXTENSIONS))
        logger.warning(f"File extension validation failed for filename: '{filename}'")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type. Allowed extensions: {allowed_str}"
        )

    destination_dir = ensure_uploads_dir_exists(target_dir)
    unique_filename = generate_unique_filename(filename)
    saved_path = (destination_dir / unique_filename).resolve()

    # Prevent path traversal attacks
    if not str(saved_path).startswith(str(destination_dir)):
        logger.error(f"Path traversal attempt detected: '{filename}' -> '{saved_path}'")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file path."
        )

    try:
        with open(saved_path, "wb") as buffer:
            while chunk := await upload_file.read(1024 * 1024):
                buffer.write(chunk)
        logger.debug(f"Saved uploaded video file to '{saved_path}'")
    except Exception as exc:
        logger.error(f"Failed to write upload file '{filename}' to '{saved_path}': {exc}", exc_info=True)
        if saved_path.exists():
            saved_path.unlink(missing_ok=True)
        raise
    finally:
        await upload_file.close()

    return saved_path
