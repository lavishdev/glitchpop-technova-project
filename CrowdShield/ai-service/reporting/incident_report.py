from dataclasses import asdict, dataclass
from typing import Any, Dict, List
from utils.logger import logger


@dataclass
class IncidentReportMetadata:
    """Metadata container for synthesized AI Incident Report."""
    summary: str
    overall_risk: str
    risk_score: float
    frames_processed: int
    people_detected: int
    highest_density: str
    recommendations: List[str]
    alerts: List[Dict[str, Any]]

    def to_dict(self) -> Dict[str, Any]:
        """Convert incident report metadata to dictionary format."""
        return asdict(self)


class IncidentReportGenerator:
    """Production-ready AI Incident Report Generator for CrowdShield."""

    def __init__(self) -> None:
        pass

    def generate_report(
        self,
        upload_info: Dict[str, Any],
        extraction_result: Dict[str, Any],
        detection_result: Dict[str, Any],
        tracking_result: Dict[str, Any],
        density_result: Dict[str, Any],
        behaviour_result: Dict[str, Any],
        risk_result: Dict[str, Any],
        recommendation_result: Dict[str, Any],
        alert_result: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Synthesize all pipeline modules into a unified executive incident report."""
        logger.info("Generating AI Incident Report...")

        filename = upload_info.get("filename", "unknown_video")
        extracted_frames = extraction_result.get("extracted_frames", 0)
        total_detections = detection_result.get("total_person_detections", 0)
        unique_people = tracking_result.get("unique_people", 0)
        highest_density = density_result.get("highest_density", "LOW")
        overall_risk = risk_result.get("overall_risk", "SAFE")
        risk_score = risk_result.get("risk_score", 0.0)
        recs = recommendation_result.get("recommendations", [])
        alerts = alert_result.get("alerts", [])

        summary_text = (
            f"AI Incident Analysis completed for video '{filename}'. "
            f"Processed {extracted_frames} frames with {total_detections} total person detections and "
            f"{unique_people} unique individuals tracked. "
            f"Highest density reached: '{highest_density}'. "
            f"Overall risk evaluated as '{overall_risk}' (score: {risk_score})."
        )

        logger.info(f"AI Incident Report generated for '{filename}': overall_risk='{overall_risk}' (score={risk_score})")

        metadata = IncidentReportMetadata(
            summary=summary_text,
            overall_risk=overall_risk,
            risk_score=risk_score,
            frames_processed=extracted_frames,
            people_detected=total_detections,
            highest_density=highest_density,
            recommendations=recs,
            alerts=alerts
        )
        return metadata.to_dict()
