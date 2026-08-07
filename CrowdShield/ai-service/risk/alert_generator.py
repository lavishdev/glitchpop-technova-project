from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from typing import Any, Dict, List
from utils.logger import logger


@dataclass
class AlertItem:
    """Individual security alert instance."""
    title: str
    message: str
    severity: str
    timestamp: str
    risk_score: float

    def to_dict(self) -> Dict[str, Any]:
        """Convert alert item instance to dictionary format."""
        return asdict(self)


@dataclass
class AlertSummaryMetadata:
    """Metadata container for generated alert list and aggregate severity."""
    alerts: List[Dict[str, Any]]
    total_alerts: int
    highest_severity: str

    def to_dict(self) -> Dict[str, Any]:
        """Convert alert summary to dictionary format."""
        return asdict(self)


class AlertGenerator:
    """Production-ready Alert Generation Engine for crowd intelligence monitoring."""

    def __init__(self) -> None:
        pass

    def generate_alerts(
        self,
        risk_assessment: Dict[str, Any],
        recommendations: Dict[str, Any],
        behaviour_analysis: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Evaluate risk assessment, recommendations, and behaviour analysis to generate structured security alerts.

        Produces 0 alerts when overall_risk is SAFE.
        """
        logger.info("Starting alert generation process...")

        overall_risk = risk_assessment.get("overall_risk", "SAFE")
        risk_score = risk_assessment.get("risk_score", 0.0)
        risk_factors = risk_assessment.get("risk_factors", [])

        # Rule: Produce zero alerts when overall_risk is SAFE
        if overall_risk == "SAFE":
            logger.info("Overall risk level is SAFE. Generating 0 alerts.")
            return AlertSummaryMetadata(
                alerts=[],
                total_alerts=0,
                highest_severity="NONE"
            ).to_dict()

        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        alerts_list: List[AlertItem] = []

        # Primary risk level alert
        if overall_risk == "CRITICAL":
            alerts_list.append(
                AlertItem(
                    title="Critical Crowd Security Alert",
                    message="Immediate emergency intervention required. Critical crowd density or panic detected.",
                    severity="CRITICAL",
                    timestamp=now_str,
                    risk_score=risk_score
                )
            )
        elif overall_risk == "HIGH":
            alerts_list.append(
                AlertItem(
                    title="High Crowd Risk Warning",
                    message="Elevated crowd congestion and high movement risk detected in monitored zone.",
                    severity="HIGH",
                    timestamp=now_str,
                    risk_score=risk_score
                )
            )
        elif overall_risk == "MEDIUM":
            alerts_list.append(
                AlertItem(
                    title="Moderate Crowd Advisory",
                    message="Crowd density and movement reaching caution thresholds. Additional staff required.",
                    severity="WARNING",
                    timestamp=now_str,
                    risk_score=risk_score
                )
            )
        elif overall_risk == "LOW":
            alerts_list.append(
                AlertItem(
                    title="Low Risk System Notice",
                    message="Minor crowd accumulation observed. Increased observation recommended.",
                    severity="INFO",
                    timestamp=now_str,
                    risk_score=risk_score
                )
            )

        # Factor-based specific alerts
        for factor in risk_factors:
            if "CRITICAL crowd congestion" in factor:
                alerts_list.append(
                    AlertItem(
                        title="Critical Congestion Alert",
                        message=factor,
                        severity="CRITICAL",
                        timestamp=now_str,
                        risk_score=risk_score
                    )
                )
            elif "surge" in factor.lower() or "stampede" in factor.lower():
                alerts_list.append(
                    AlertItem(
                        title="Crowd Surge & Rapid Movement Alert",
                        message=factor,
                        severity="HIGH",
                        timestamp=now_str,
                        risk_score=risk_score
                    )
                )
            elif "suspicious" in factor.lower() or "loitering" in factor.lower():
                alerts_list.append(
                    AlertItem(
                        title="Suspicious Behaviour Notice",
                        message=factor,
                        severity="WARNING",
                        timestamp=now_str,
                        risk_score=risk_score
                    )
                )

        # Determine highest severity level
        severities = [a.severity for a in alerts_list]
        if "CRITICAL" in severities:
            highest_sev = "CRITICAL"
        elif "HIGH" in severities:
            highest_sev = "HIGH"
        elif "WARNING" in severities:
            highest_sev = "WARNING"
        elif "INFO" in severities:
            highest_sev = "INFO"
        else:
            highest_sev = "NONE"

        logger.info(f"Generated {len(alerts_list)} alert(s) with highest severity '{highest_sev}'.")

        summary = AlertSummaryMetadata(
            alerts=[a.to_dict() for a in alerts_list],
            total_alerts=len(alerts_list),
            highest_severity=highest_sev
        )
        return summary.to_dict()
