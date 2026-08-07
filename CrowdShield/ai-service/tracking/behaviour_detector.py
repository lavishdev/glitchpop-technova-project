import math
from dataclasses import asdict, dataclass
from typing import Any, Dict, List, Optional, Tuple

from utils.logger import logger


@dataclass
class FrameBehaviourInfo:
    """Behaviour analysis metadata for a single frame."""
    frame: str
    behaviour_label: str
    risk_score: float
    suspicious_tracks: int

    def to_dict(self) -> Dict[str, Any]:
        """Convert frame behaviour info instance to dictionary."""
        return asdict(self)


@dataclass
class BehaviourAnalysisMetadata:
    """Aggregate suspicious behaviour analysis metadata for a video sequence."""
    total_frames_analyzed: int
    overall_behaviour: str
    max_risk_score: float
    average_risk_score: float
    suspicious_events_count: int
    frames: List[Dict[str, Any]]

    def to_dict(self) -> Dict[str, Any]:
        """Convert behaviour analysis summary to dictionary."""
        return asdict(self)


class BehaviourDetector:
    """Production-ready Suspicious Crowd Behaviour Detection Engine."""

    def __init__(
        self,
        speed_threshold: float = 30.0,
        loiter_max_displacement: float = 15.0,
        loiter_min_frames: int = 15,
        surge_threshold_ratio: float = 0.5
    ) -> None:
        self.speed_threshold = speed_threshold
        self.loiter_max_displacement = loiter_max_displacement
        self.loiter_min_frames = loiter_min_frames
        self.surge_threshold_ratio = surge_threshold_ratio

    def analyze_behaviour(
        self,
        tracking_result: Dict[str, Any],
        crowd_density_result: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Analyze object trajectories and density data to detect abnormal crowd behaviors."""
        logger.info("Starting suspicious crowd behaviour detection...")
        tracks = tracking_result.get("tracks", [])

        tracks_by_frame: Dict[str, List[Dict[str, Any]]] = {}
        history_by_track: Dict[int, List[Tuple[str, int, int]]] = {}

        for tr in tracks:
            f_name = tr.get("frame", "")
            t_id = tr.get("track_id", 0)
            bbox = tr.get("bbox", [])
            if not f_name or len(bbox) < 4:
                continue

            cx = (bbox[0] + bbox[2]) // 2
            cy = (bbox[1] + bbox[3]) // 2

            if f_name not in tracks_by_frame:
                tracks_by_frame[f_name] = []
            tracks_by_frame[f_name].append(tr)

            if t_id > 0:
                if t_id not in history_by_track:
                    history_by_track[t_id] = []
                history_by_track[t_id].append((f_name, cx, cy))

        density_by_frame: Dict[str, str] = {}
        if crowd_density_result:
            for f_info in crowd_density_result.get("frames", []):
                density_by_frame[f_info.get("frame", "")] = f_info.get("density", "LOW")

        sorted_frames = sorted(tracks_by_frame.keys())
        total_frames = len(sorted_frames)

        if total_frames == 0:
            logger.warning("No tracks provided for behaviour analysis.")
            return BehaviourAnalysisMetadata(
                total_frames_analyzed=0,
                overall_behaviour="NORMAL",
                max_risk_score=0.0,
                average_risk_score=0.0,
                suspicious_events_count=0,
                frames=[]
            ).to_dict()

        frame_results: List[FrameBehaviourInfo] = []
        risk_scores: List[float] = []
        suspicious_event_counter = 0
        prev_count = 0

        for frame_idx, f_name in enumerate(sorted_frames):
            frame_tracks = tracks_by_frame[f_name]
            curr_count = len(frame_tracks)
            density_level = density_by_frame.get(f_name, "LOW")

            suspicious_tracks_in_frame = 0
            labels_set = set()

            for tr in frame_tracks:
                t_id = tr.get("track_id", 0)
                if t_id <= 0:
                    continue

                hist = history_by_track.get(t_id, [])
                if len(hist) >= 2:
                    prev_f, px, py = hist[-2] if hist[-1][0] == f_name and len(hist) >= 2 else hist[-1]
                    cx = (tr["bbox"][0] + tr["bbox"][2]) // 2
                    cy = (tr["bbox"][1] + tr["bbox"][3]) // 2
                    speed = math.hypot(cx - px, cy - py)

                    if speed > self.speed_threshold:
                        suspicious_tracks_in_frame += 1
                        labels_set.add("HIGH_SPEED_MOVEMENT")

                if len(hist) >= self.loiter_min_frames:
                    init_x, init_y = hist[0][1], hist[0][2]
                    curr_x, curr_y = hist[-1][1], hist[-1][2]
                    displacement = math.hypot(curr_x - init_x, curr_y - init_y)
                    if displacement <= self.loiter_max_displacement:
                        suspicious_tracks_in_frame += 1
                        labels_set.add("STATIONARY_LOITERING")

            if frame_idx > 0 and prev_count > 0:
                count_diff = curr_count - prev_count
                if count_diff >= math.ceil(prev_count * self.surge_threshold_ratio):
                    labels_set.add("CROWD_SURGE")

            prev_count = curr_count

            if density_level == "CRITICAL" and "HIGH_SPEED_MOVEMENT" in labels_set:
                labels_set.add("STAMPEDE_RISK")
            elif density_level in ("HIGH", "CRITICAL") and "CROWD_SURGE" in labels_set:
                labels_set.add("CONGESTION_SPIKE")

            base_risk = 0.1
            if density_level == "MEDIUM":
                base_risk = 0.3
            elif density_level == "HIGH":
                base_risk = 0.6
            elif density_level == "CRITICAL":
                base_risk = 0.85

            if "STAMPEDE_RISK" in labels_set:
                frame_risk = 0.95
            elif "CROWD_SURGE" in labels_set or "HIGH_SPEED_MOVEMENT" in labels_set:
                frame_risk = min(1.0, base_risk + 0.3)
            elif "STATIONARY_LOITERING" in labels_set:
                frame_risk = min(1.0, base_risk + 0.15)
            else:
                frame_risk = base_risk

            frame_risk = round(frame_risk, 2)
            risk_scores.append(frame_risk)

            if "STAMPEDE_RISK" in labels_set:
                label = "STAMPEDE_RISK"
            elif "CROWD_SURGE" in labels_set:
                label = "CROWD_SURGE"
            elif "HIGH_SPEED_MOVEMENT" in labels_set:
                label = "ABNORMAL_SPEED"
            elif "STATIONARY_LOITERING" in labels_set:
                label = "STATIONARY_LOITERING"
            elif density_level == "CRITICAL":
                label = "CRITICAL_CONGESTION"
            else:
                label = "NORMAL"

            if label != "NORMAL":
                suspicious_event_counter += 1

            frame_results.append(
                FrameBehaviourInfo(
                    frame=f_name,
                    behaviour_label=label,
                    risk_score=frame_risk,
                    suspicious_tracks=suspicious_tracks_in_frame
                )
            )

        max_risk = max(risk_scores) if risk_scores else 0.0
        avg_risk = round(sum(risk_scores) / float(len(risk_scores)), 2) if risk_scores else 0.0

        if max_risk >= 0.85:
            overall_behaviour = "CRITICAL_RISK"
        elif max_risk >= 0.6:
            overall_behaviour = "ELEVATED_RISK"
        elif max_risk >= 0.3:
            overall_behaviour = "MODERATE_RISK"
        else:
            overall_behaviour = "NORMAL"

        logger.info(
            f"Suspicious behaviour detection completed: overall='{overall_behaviour}', "
            f"max_risk={max_risk}, suspicious_events={suspicious_event_counter}"
        )

        metadata = BehaviourAnalysisMetadata(
            total_frames_analyzed=total_frames,
            overall_behaviour=overall_behaviour,
            max_risk_score=max_risk,
            average_risk_score=avg_risk,
            suspicious_events_count=suspicious_event_counter,
            frames=[f.to_dict() for f in frame_results]
        )
        return metadata.to_dict()
