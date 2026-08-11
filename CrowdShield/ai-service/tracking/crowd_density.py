from dataclasses import asdict, dataclass
from typing import Any, Dict, List
from utils.logger import logger

DENSITY_LEVELS: List[str] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]


@dataclass
class FrameDensityInfo:
    """Density classification metadata for a single video frame."""
    frame: str
    people_count: int
    density: str

    def to_dict(self) -> Dict[str, Any]:
        """Convert frame density info to dictionary."""
        return asdict(self)


@dataclass
class DensitySummary:
    """Aggregate crowd density metadata summary for a full video sequence."""
    total_frames: int
    average_people: float
    maximum_people: int
    minimum_people: int
    highest_density: str
    frames: List[Dict[str, Any]]

    def to_dict(self) -> Dict[str, Any]:
        """Convert density summary to dictionary."""
        return asdict(self)


class CrowdDensityEstimator:
    """Production-ready Crowd Density Estimation Engine."""

    def __init__(
        self,
        low_threshold: int = 5,
        medium_threshold: int = 15,
        high_threshold: int = 30
    ) -> None:
        self.low_threshold = low_threshold
        self.medium_threshold = medium_threshold
        self.high_threshold = high_threshold

    def classify_density(self, count: int) -> str:
        """Classify headcount into density levels: LOW, MEDIUM, HIGH, CRITICAL."""
        if count <= self.low_threshold:
            return "LOW"
        elif count <= self.medium_threshold:
            return "MEDIUM"
        elif count <= self.high_threshold:
            return "HIGH"
        else:
            return "CRITICAL"

    def estimate_density_from_tracks(self, tracking_results: Dict[str, Any]) -> Dict[str, Any]:
        """Estimate crowd density per frame and calculate video-wide statistics from tracking results."""
        tracks = tracking_results.get("tracks", [])

        # Group unique track IDs or count detected people per frame
        frame_counts: Dict[str, set] = {}
        for track in tracks:
            frame_name = track.get("frame", "")
            track_id = track.get("track_id", 0)
            if frame_name not in frame_counts:
                frame_counts[frame_name] = set()
            if track_id > 0:
                frame_counts[frame_name].add(track_id)

        sorted_frame_names = sorted(frame_counts.keys())
        total_frames = len(sorted_frame_names)

        if total_frames == 0:
            logger.warning("No tracking data provided for crowd density estimation.")
            return DensitySummary(
                total_frames=0,
                average_people=0.0,
                maximum_people=0,
                minimum_people=0,
                highest_density="LOW",
                frames=[]
            ).to_dict()

        frame_density_list: List[FrameDensityInfo] = []
        counts_list: List[int] = []
        highest_level_index = 0

        for frame_name in sorted_frame_names:
            people_count = len(frame_counts[frame_name])
            density_level = self.classify_density(people_count)
            counts_list.append(people_count)

            level_idx = DENSITY_LEVELS.index(density_level)
            if level_idx > highest_level_index:
                highest_level_index = level_idx

            frame_density_list.append(
                FrameDensityInfo(
                    frame=frame_name,
                    people_count=people_count,
                    density=density_level
                )
            )

        avg_people = round(sum(counts_list) / float(total_frames), 1)
        max_people = max(counts_list)
        min_people = min(counts_list)
        highest_density = DENSITY_LEVELS[highest_level_index]

        logger.info(
            f"Crowd density estimation complete across {total_frames} frames: "
            f"avg={avg_people}, max={max_people}, min={min_people}, highest_density='{highest_density}'"
        )

        summary = DensitySummary(
            total_frames=total_frames,
            average_people=avg_people,
            maximum_people=max_people,
            minimum_people=min_people,
            highest_density=highest_density,
            frames=[fd.to_dict() for fd in frame_density_list]
        )
        return summary.to_dict()
