from dataclasses import asdict, dataclass
from typing import Any, Dict, List
from utils.logger import logger


@dataclass
class RecommendationMetadata:
    """Metadata container for intelligent crowd management recommendations."""
    recommendations: List[str]

    def to_dict(self) -> Dict[str, Any]:
        """Convert recommendation metadata to dictionary format."""
        return asdict(self)


class IntelligentRecommendationEngine:
    """Production-ready Intelligent Recommendation Engine for crowd management and emergency response."""

    def __init__(self) -> None:
        pass

    def generate_recommendations(self, risk_assessment_result: Dict[str, Any]) -> Dict[str, Any]:
        """Generate targeted, actionable crowd management recommendations based on risk assessment evaluation."""
        logger.info("Generating intelligent crowd management recommendations...")

        overall_risk = risk_assessment_result.get("overall_risk", "SAFE")
        risk_score = risk_assessment_result.get("risk_score", 0.0)
        risk_factors = risk_assessment_result.get("risk_factors", [])

        recommendations: List[str] = []

        if overall_risk == "SAFE":
            recommendations.append("Continue monitoring standard video streams.")
            recommendations.append("Perimeter surveillance and camera coverage optimal.")

        elif overall_risk == "LOW":
            recommendations.append("Increase observation frequency on active camera feeds.")
            recommendations.append("Monitor key entry and exit points for gathering crowds.")

        elif overall_risk == "MEDIUM":
            recommendations.append("Deploy additional security and crowd management staff to active zones.")
            recommendations.append("Prepare overflow gate management protocols.")
            recommendations.append("Issue advisory alert to local ground security operators.")

        elif overall_risk == "HIGH":
            recommendations.append("Restrict entry into high-density zone.")
            recommendations.append("Notify control room operators immediately.")
            recommendations.append("Reroute incoming pedestrian flow towards low-density corridors.")
            recommendations.append("Prepare security intervention and barrier teams.")

        elif overall_risk == "CRITICAL":
            recommendations.append("Dispatch emergency response units immediately.")
            recommendations.append("Initiate immediate evacuation of affected high-density zone.")
            recommendations.append("Contact emergency services and local municipal authorities.")
            recommendations.append("Unlock and open all emergency exit gates.")

        # Specific factor-driven recommendations
        for factor in risk_factors:
            if "CRITICAL crowd congestion" in factor or "High crowd density" in factor:
                recommendations.append("Open secondary relief pathways to alleviate bottleneck congestion.")
            elif "suspicious crowd behaviour" in factor or "abnormal" in factor:
                recommendations.append("Dispatch security personnel to investigate localized suspicious crowd activity.")
            elif "surge" in factor.lower():
                recommendations.append("Activate turnstile throttles to regulate rapid inflow surge.")

        # Deduplicate while preserving sequence order
        unique_recs: List[str] = []
        for rec in recommendations:
            if rec not in unique_recs:
                unique_recs.append(rec)

        logger.info(
            f"Generated {len(unique_recs)} recommendation(s) for overall risk level '{overall_risk}' (score: {risk_score})"
        )

        metadata = RecommendationMetadata(recommendations=unique_recs)
        return metadata.to_dict()
