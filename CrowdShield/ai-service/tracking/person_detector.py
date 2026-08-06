from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional, Union
import cv2
from ultralytics import YOLO

from config.settings import settings
from utils.logger import logger

PERSON_CLASS_ID: int = 0


@dataclass
class DetectionMetadata:
    """Metadata container for batch person detection execution."""
    total_frames_processed: int
    frames_with_persons: int
    total_person_detections: int
    per_frame_counts: List[Dict[str, Any]]
    detections_directory: str

    def to_dict(self) -> Dict[str, Any]:
        """Convert detection metadata instance to dictionary."""
        return asdict(self)


class PersonDetector:
    """Production-ready YOLOv11 Person Detection engine for frame sequences."""

    _model_instance: Optional[YOLO] = None
    _default_model_name: str = "yolo11n.pt"

    def __init__(
        self,
        model_path: Optional[Union[str, Path]] = None,
        confidence_threshold: float = 0.25,
        output_base_dir: Optional[Union[str, Path]] = None
    ) -> None:
        self.confidence_threshold = confidence_threshold
        self.model_name = str(model_path) if model_path else self._default_model_name
        self._ensure_model_loaded(self.model_name)

        if output_base_dir:
            self.output_base_dir = Path(output_base_dir).resolve()
        else:
            self.output_base_dir = Path(settings.OUTPUTS_DIR).resolve() / "detections"

    @classmethod
    def _ensure_model_loaded(cls, model_name: str = "yolo11n.pt") -> YOLO:
        """Singleton pattern ensuring YOLOv11 model weights are loaded only once."""
        if cls._model_instance is None:
            logger.info(f"Loading YOLOv11 model weights: '{model_name}'...")
            try:
                cls._model_instance = YOLO(model_name)
                logger.info(f"YOLOv11 model '{model_name}' loaded successfully.")
            except Exception as exc:
                logger.error(f"Failed to load YOLOv11 model '{model_name}': {exc}", exc_info=True)
                raise RuntimeError(f"Could not initialize YOLOv11 model: {exc}")
        return cls._model_instance

    def process_frames_directory(self, frames_dir: Union[str, Path]) -> Dict[str, Any]:
        """Process all extracted frame images in a directory, perform person detection,

        draw green bounding boxes, save annotated frames, and aggregate metadata.
        """
        frames_path = Path(frames_dir).resolve()
        if not frames_path.exists() or not frames_path.is_dir():
            logger.error(f"Frames directory not found for detection: '{frames_path}'")
            raise FileNotFoundError(f"Frames directory does not exist: {frames_path}")

        video_name = frames_path.name
        output_detections_dir = self.output_base_dir / video_name
        output_detections_dir.mkdir(parents=True, exist_ok=True)

        frame_files = sorted(list(frames_path.glob("*.jpg")) + list(frames_path.glob("*.png")))
        if not frame_files:
            logger.warning(f"No image frames found in directory: '{frames_path}'")

        total_frames_processed = 0
        frames_with_persons = 0
        total_person_detections = 0
        per_frame_counts: List[Dict[str, Any]] = []

        logger.info(f"Starting person detection for video '{video_name}' ({len(frame_files)} frames)")

        for frame_file in frame_files:
            total_frames_processed += 1
            frame = cv2.imread(str(frame_file))

            if frame is None:
                logger.warning(f"Failed to read image frame (possibly corrupted): '{frame_file.name}'")
                per_frame_counts.append({"frame": frame_file.name, "count": 0})
                continue

            try:
                results = self._model_instance(
                    frame,
                    conf=self.confidence_threshold,
                    classes=[PERSON_CLASS_ID],
                    verbose=False
                )
            except Exception as exc:
                logger.error(f"Detection failed on frame '{frame_file.name}': {exc}", exc_info=True)
                per_frame_counts.append({"frame": frame_file.name, "count": 0})
                continue

            frame_person_count = 0

            for result in results:
                boxes = result.boxes
                if boxes is None or len(boxes) == 0:
                    continue

                for box in boxes:
                    cls_id = int(box.cls[0].item())
                    if cls_id != PERSON_CLASS_ID:
                        continue

                    conf = float(box.conf[0].item())
                    xyxy = box.xyxy[0].tolist()

                    x1, y1, x2, y2 = int(xyxy[0]), int(xyxy[1]), int(xyxy[2]), int(xyxy[3])
                    frame_person_count += 1

                    # Draw green bounding box (BGR green: (0, 255, 0))
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    label = f"Person {conf:.2f}"
                    cv2.putText(
                        frame,
                        label,
                        (x1, max(y1 - 10, 20)),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.5,
                        (0, 255, 0),
                        2
                    )

            if frame_person_count > 0:
                frames_with_persons += 1
            total_person_detections += frame_person_count

            per_frame_counts.append({
                "frame": frame_file.name,
                "count": frame_person_count
            })

            output_annotated_path = output_detections_dir / frame_file.name
            cv2.imwrite(str(output_annotated_path), frame)

        logger.info(
            f"Person detection complete for '{video_name}': "
            f"{total_person_detections} total detections across {frames_with_persons}/{total_frames_processed} frames"
        )

        metadata = DetectionMetadata(
            total_frames_processed=total_frames_processed,
            frames_with_persons=frames_with_persons,
            total_person_detections=total_person_detections,
            per_frame_counts=per_frame_counts,
            detections_directory=str(output_detections_dir)
        )

        return metadata.to_dict()
