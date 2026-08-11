from dataclasses import asdict, dataclass
from typing import Any, Dict, List
from utils.logger import logger

RISK_LEVELS: List[str] = ["SAFE", "LOW", "MEDIUM", "HIGH", "CRITICAL"]


@dataclass
class RiskAssessmentMetadata:
    """Metadata container for unified risk assessment evaluation."""
    overall_risk: str
    risk_score: float
    risk_factors: List[str]

    def to_dict(self) -> Dict[str, Any]:
        """Convert risk assessment metadata to dictionary format."""
        return asdict(self)


class UnifiedRiskAssessor:
    """Production-ready Unified Risk Assessment Engine combining density, behaviour, tracking, and detection analytics."""

    def __init__(self) -> None:
        pass

    def evaluate_risk(
        self,
        detection_result: Dict[str, Any],
        tracking_result: Dict[str, Any],
        density_result: Dict[str, Any],
        behaviour_result: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Aggregate analytics from all AI pipeline components and compute unified risk metrics."""
        logger.info("Starting unified risk assessment evaluation...")

        risk_factors: List[str] = []
        score_components: List[float] = []

        # 1. Density Factor Analysis
        highest_density = density_result.get("highest_density", "LOW")
        avg_people = density_result.get("average_people", 0.0)
        max_people = density_result.get("maximum_people", 0)

        density_score = 0.10
        if highest_density == "MEDIUM":
            density_score = 0.35
            risk_factors.append(f"Moderate crowd density observed (avg: {avg_people}, peak: {max_people}).")
        elif highest_density == "HIGH":
            density_score = 0.65
            risk_factors.append(f"High crowd density peak detected ({max_people} people in frame).")
        elif highest_density == "CRITICAL":
            density_score = 0.90
            risk_factors.append(f"CRITICAL crowd congestion detected ({max_people} people in frame).")
        else:
            risk_factors.append(f"Low crowd density (avg: {avg_people} people).")
        score_components.append(density_score * 0.35)

        # 2. Behaviour Factor Analysis
        behaviour_max_risk = behaviour_result.get("max_risk_score", 0.0)
        suspicious_events = behaviour_result.get("suspicious_events_count", 0)
        overall_beh = behaviour_result.get("overall_behaviour", "NORMAL")

        score_components.append(behaviour_max_risk * 0.40)
        if suspicious_events > 0:
            risk_factors.append(f"Detected {suspicious_events} suspicious crowd behaviour event(s).")
        if overall_beh != "NORMAL":
            risk_factors.append(f"Crowd behaviour pattern classified as '{overall_beh}'.")

        # 3. Multi-Object Tracking Factor Analysis
        unique_people = tracking_result.get("unique_people", 0)

        if unique_people > 30:
            score_components.append(0.15)
            risk_factors.append(f"Large volume of distinct individuals tracked ({unique_people} unique persons).")
        elif unique_people > 15:
            score_components.append(0.08)
        else:
            score_components.append(0.02)

        # 4. Person Detection Density Persistence
        total_detections = detection_result.get("total_person_detections", 0)
        frames_with_persons = detection_result.get("frames_with_persons", 0)

        if frames_with_persons > 0 and total_detections / max(1, frames_with_persons) > 20:
            score_components.append(0.10)
            risk_factors.append("High continuous presence of dense crowd clusters across frames.")

        # Calculate Final Risk Score (range: 0.0 to 1.0)
        raw_score = sum(score_components)
        final_risk_score = min(1.0, max(0.0, round(raw_score, 2)))

        # Categorize Overall Risk Level
        if final_risk_score >= 0.80:
            overall_risk = "CRITICAL"
        elif final_risk_score >= 0.60:
            overall_risk = "HIGH"
        elif final_risk_score >= 0.35:
            overall_risk = "MEDIUM"
        elif final_risk_score >= 0.15:
            overall_risk = "LOW"
        else:
            overall_risk = "SAFE"

        logger.info(
            f"Unified risk assessment complete: overall_risk='{overall_risk}', "
            f"risk_score={final_risk_score}, factors_count={len(risk_factors)}"
        )

        metadata = RiskAssessmentMetadata(
            overall_risk=overall_risk,
            risk_score=final_risk_score,
            risk_factors=risk_factors
        )
        return metadata.to_dict()
