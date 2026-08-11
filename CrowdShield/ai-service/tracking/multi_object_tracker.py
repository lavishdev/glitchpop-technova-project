from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional, Union
import cv2
from ultralytics import YOLO

from utils.logger import logger

PERSON_CLASS_ID: int = 0


@dataclass
class TrackedObject:
    """Dataclass representing a tracked person object in a frame."""
    frame: str
    track_id: int
    bbox: List[int]
    confidence: float
    class_id: int = PERSON_CLASS_ID

    def to_dict(self) -> Dict[str, Any]:
        """Convert tracked object instance to dictionary format."""
        return {
            "frame": self.frame,
            "track_id": self.track_id,
            "bbox": self.bbox,
            "confidence": self.confidence,
        }


@dataclass
class TrackingSummary:
    """Metadata container for multi-object tracking summary results."""
    tracked_frames: int
    unique_people: int
    tracks: List[Dict[str, Any]]

    def to_dict(self) -> Dict[str, Any]:
        """Convert tracking summary to dictionary."""
        return asdict(self)


class MultiObjectTracker:
    """Production-ready Multi-Object Tracker engine using YOLOv11 ByteTrack."""

    def __init__(
        self,
        model_name: str = "yolo11n.pt",
        confidence_threshold: float = 0.25,
        tracker_type: str = "bytetrack.yaml"
    ) -> None:
        self.model_name = model_name
        self.confidence_threshold = confidence_threshold
        self.tracker_type = tracker_type
        self.model: Optional[YOLO] = None
        self.tracking_results: List[TrackedObject] = []
        self.unique_track_ids: set = set()
        self.tracked_frames_count: int = 0
        self.initialize_tracker()

    def initialize_tracker(self) -> None:
        """Initialize or reload the underlying YOLO ByteTrack model instance."""
        logger.info(f"Initializing MultiObjectTracker with model '{self.model_name}' and '{self.tracker_type}'...")
        try:
            self.model = YOLO(self.model_name)
            self.reset()
            logger.info("MultiObjectTracker initialized successfully.")
        except Exception as exc:
            logger.error(f"Failed to initialize MultiObjectTracker: {exc}", exc_info=True)
            raise RuntimeError(f"Could not initialize tracker model: {exc}")

    def reset(self) -> None:
        """Reset internal tracking state, ID memory, and results."""
        self.tracking_results = []
        self.unique_track_ids = set()
        self.tracked_frames_count = 0
        if self.model and hasattr(self.model, "predictor") and self.model.predictor:
            try:
                self.model.predictor.trackers[0].reset()
            except Exception:
                pass
        logger.debug("MultiObjectTracker state reset.")

    def update(self, frame: Any, frame_name: str) -> List[TrackedObject]:
        """Process a single image frame using ByteTrack and update tracking history."""
        if self.model is None:
            raise RuntimeError("MultiObjectTracker model is not initialized.")

        frame_tracks: List[TrackedObject] = []
        try:
            results = self.model.track(
                frame,
                persist=True,
                tracker=self.tracker_type,
                conf=self.confidence_threshold,
                classes=[PERSON_CLASS_ID],
                verbose=False
            )
        except Exception as exc:
            logger.error(f"ByteTrack update failed for frame '{frame_name}': {exc}", exc_info=True)
            return frame_tracks

        for result in results:
            boxes = result.boxes
            if boxes is None or len(boxes) == 0:
                continue

            for box in boxes:
                cls_id = int(box.cls[0].item())
                if cls_id != PERSON_CLASS_ID:
                    continue

                track_id = int(box.id[0].item()) if box.id is not None else 0
                conf = float(box.conf[0].item())
                xyxy = box.xyxy[0].tolist()

                x1, y1, x2, y2 = int(round(xyxy[0])), int(round(xyxy[1])), int(round(xyxy[2])), int(round(xyxy[3]))

                tracked_obj = TrackedObject(
                    frame=frame_name,
                    track_id=track_id,
                    bbox=[x1, y1, x2, y2],
                    confidence=round(conf, 4),
                    class_id=PERSON_CLASS_ID
                )

                frame_tracks.append(tracked_obj)
                self.tracking_results.append(tracked_obj)
                if track_id > 0:
                    self.unique_track_ids.add(track_id)

        self.tracked_frames_count += 1
        return frame_tracks

    def process_frames_directory(self, frames_dir: Union[str, Path]) -> Dict[str, Any]:
        """Batch process a directory of extracted video frames using ByteTrack."""
        frames_path = Path(frames_dir).resolve()
        if not frames_path.exists() or not frames_path.is_dir():
            logger.error(f"Frames directory not found for tracking: '{frames_path}'")
            raise FileNotFoundError(f"Frames directory does not exist: {frames_path}")

        self.reset()
        frame_files = sorted(list(frames_path.glob("*.jpg")) + list(frames_path.glob("*.png")))
        logger.info(f"Starting ByteTrack multi-object tracking for '{frames_path.name}' ({len(frame_files)} frames)...")

        for frame_file in frame_files:
            frame = cv2.imread(str(frame_file))
            if frame is None:
                logger.warning(f"Skipping unreadable frame image: '{frame_file.name}'")
                continue

            self.update(frame, frame_name=frame_file.name)

        logger.info(
            f"Multi-object tracking complete for '{frames_path.name}': "
            f"{len(self.unique_track_ids)} unique people across {self.tracked_frames_count} frames"
        )
        return self.get_tracking_results()

    def get_tracking_results(self) -> Dict[str, Any]:
        """Return aggregated dictionary summary of tracking results."""
        summary = TrackingSummary(
            tracked_frames=self.tracked_frames_count,
            unique_people=len(self.unique_track_ids),
            tracks=[t.to_dict() for t in self.tracking_results]
        )
        return summary.to_dict()
