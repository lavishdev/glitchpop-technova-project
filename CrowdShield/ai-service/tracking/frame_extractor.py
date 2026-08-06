from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Dict, Union

import cv2

from config.settings import settings
from utils.logger import logger


@dataclass
class FrameMetadata:
    """Metadata container for extracted video frames."""
    video_name: str
    fps: float
    total_frames: int
    width: int
    height: int
    frames_directory: str
    extracted_frames: int

    def to_dict(self) -> Dict[str, Any]:
        """Convert metadata instance to a dictionary."""
        return asdict(self)


class FrameExtractor:
    """Production-ready video frame extraction engine using OpenCV."""

    def __init__(
        self,
        video_path: Union[str, Path],
        output_base_dir: Union[str, Path] = None
    ) -> None:
        self.video_path = Path(video_path).resolve()
        if output_base_dir:
            self.output_base_dir = Path(output_base_dir).resolve()
        else:
            self.output_base_dir = Path(settings.OUTPUTS_DIR).resolve() / "frames"

    def open_video(self) -> cv2.VideoCapture:
        """Open the video file and validate that OpenCV can read it."""
        if not self.video_path.exists():
            logger.error(f"Video file not found at path: '{self.video_path}'")
            raise FileNotFoundError(f"Video file does not exist: {self.video_path}")

        cap = cv2.VideoCapture(str(self.video_path))
        if not cap.isOpened():
            logger.error(f"OpenCV failed to open video file: '{self.video_path}'")
            raise ValueError(f"Unable to open video file: {self.video_path}")

        return cap

    def extract_frames(self) -> Dict[str, Any]:
        """Extract all frames sequentially from the video file and return execution metadata."""
        cap = self.open_video()

        video_filename = self.video_path.name
        video_name = self.video_path.stem
        frames_dir = self.output_base_dir / video_name
        frames_dir.mkdir(parents=True, exist_ok=True)

        try:
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            fps = float(cap.get(cv2.CAP_PROP_FPS))
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

            logger.info(
                f"Extracting frames for '{video_filename}' "
                f"({total_frames} total frames, {fps:.2f} FPS, {width}x{height})"
            )

            frame_idx = 1
            extracted_count = 0

            while True:
                ret, frame = cap.read()
                if not ret:
                    break

                frame_filename = f"frame_{frame_idx:06d}.jpg"
                frame_path = frames_dir / frame_filename

                success = cv2.imwrite(str(frame_path), frame)
                if not success:
                    logger.warning(f"Failed to write frame image: '{frame_path}'")
                    continue

                extracted_count += 1
                frame_idx += 1

            logger.info(f"Successfully extracted {extracted_count} frames to '{frames_dir}'")

            metadata = FrameMetadata(
                video_name=video_name,
                fps=round(fps, 2),
                total_frames=total_frames if total_frames > 0 else extracted_count,
                width=width,
                height=height,
                frames_directory=str(frames_dir),
                extracted_frames=extracted_count
            )

            return metadata.to_dict()

        finally:
            cap.release()
            logger.debug(f"Released OpenCV VideoCapture resource for '{self.video_path}'")
