from typing import Any, Dict, List
from utils.logger import logger

class RuleBasedSimulator:
    """Production-ready deterministic Rule-Based Crowd Simulation Engine.
    
    Predicts next 5 minutes crowd movement & risk using current density, tracking, and risk assessment data.
    """

    def __init__(self) -> None:
        pass

    def simulate(
        self,
        tracking_result: Dict[str, Any],
        density_result: Dict[str, Any],
        risk_result: Dict[str, Any],
        behaviour_result: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Perform a deterministic rule-based simulation of crowd movement and risk for the next 5 minutes."""
        logger.info("Starting rule-based crowd simulation...")

        # 1. Extract baseline parameters
        initial_count = int(density_result.get("maximum_people", 0))
        if initial_count == 0:
            initial_count = int(density_result.get("average_people", 0))

        initial_risk_score = float(risk_result.get("risk_score", 0.0))
        initial_risk_level = risk_result.get("overall_risk", "SAFE")
        overall_behaviour = behaviour_result.get("overall_behaviour", "NORMAL")
        suspicious_tracks = behaviour_result.get("suspicious_events_count", 0)

        # 2. Determine growth factor and movement dynamics based on current status
        growth_factor = 0.0
        movement_trend = "NORMAL_CIRCULATION"
        movement_detail = "Crowd flow is stable with normal pedestrian circulation."

        # Detect surge behaviour or high risk to adjust simulation dynamics
        has_surge = "CROWD_SURGE" in str(behaviour_result.get("frames", []))
        has_stampede = "STAMPEDE_RISK" in str(behaviour_result.get("frames", []))
        has_loitering = "STATIONARY_LOITERING" in str(behaviour_result.get("frames", []))
        has_speed = "HIGH_SPEED_MOVEMENT" in str(behaviour_result.get("frames", [])) or "ABNORMAL_SPEED" in str(behaviour_result.get("frames", []))

        if has_surge:
            growth_factor = 0.15
            movement_trend = "INFLOW_SURGE"
            movement_detail = "Rapid inflow surge detected; crowd count is projected to increase rapidly."
        elif has_stampede:
            growth_factor = 0.02
            movement_trend = "PANIC_FLOW"
            movement_detail = "High congestion with stampede risk; movement is restricted and chaotic."
        elif has_loitering:
            growth_factor = 0.06
            movement_trend = "STATIC_ACCUMULATION"
            movement_detail = "Stationary loitering observed; crowd is accumulating static density."
        elif has_speed:
            growth_factor = 0.08
            movement_trend = "RAPID_FLOW"
            movement_detail = "Abnormal movement speeds detected; rapid spatial realignment in progress."
        elif initial_risk_level in ("HIGH", "CRITICAL"):
            growth_factor = 0.03
            movement_trend = "CONGESTION_STAGNATION"
            movement_detail = "High density causing movement stagnation and bottleneck formations."
        else:
            # Safe/low risk normal dispersion or minor fluctuations
            growth_factor = -0.03
            movement_trend = "NORMAL_DISPERSION"
            movement_detail = "Crowd is gradually dispersing or maintaining stable circulation."

        # 3. Simulate minute-by-minute for the next 5 minutes
        projections: List[Dict[str, Any]] = []
        max_predicted_score = initial_risk_score
        
        for minute in range(1, 6):
            # Predict headcount based on growth factor
            predicted_count = max(0, int(initial_count * (1 + growth_factor * minute)))
            
            # Classify predicted density
            if predicted_count <= 5:
                pred_density = "LOW"
            elif predicted_count <= 15:
                pred_density = "MEDIUM"
            elif predicted_count <= 30:
                pred_density = "HIGH"
            else:
                pred_density = "CRITICAL"

            # Simulate risk score propagation
            # Risk increases if crowd is surging or accumulating, decreases if dispersing safely
            score_delta = growth_factor * 0.5 * minute
            pred_score = initial_risk_score + score_delta
            
            # Enforce safety floors based on projected density levels
            if pred_density == "CRITICAL":
                pred_score = max(pred_score, 0.85)
            elif pred_density == "HIGH":
                pred_score = max(pred_score, 0.60)
            elif pred_density == "MEDIUM":
                pred_score = max(pred_score, 0.35)

            # Cap risk score between 0.0 and 1.0
            pred_score = min(1.0, max(0.0, round(pred_score, 2)))
            if pred_score > max_predicted_score:
                max_predicted_score = pred_score

            # Categorize predicted risk level
            if pred_score >= 0.80:
                pred_risk_level = "CRITICAL"
            elif pred_score >= 0.60:
                pred_risk_level = "HIGH"
            elif pred_score >= 0.35:
                pred_risk_level = "MEDIUM"
            elif pred_score >= 0.15:
                pred_risk_level = "LOW"
            else:
                pred_risk_level = "SAFE"

            # Describe minute specific movement projection
            min_desc = f"Minute {minute}: Projected headcount is {predicted_count} ({pred_density} density). {movement_detail}"

            projections.append({
                "minute": minute,
                "predicted_crowd_count": predicted_count,
                "predicted_density_level": pred_density,
                "predicted_risk_level": pred_risk_level,
                "predicted_risk_score": pred_score,
                "movement_description": min_desc
            })

        # Determine overall max predicted risk level
        if max_predicted_score >= 0.80:
            overall_pred_level = "CRITICAL"
        elif max_predicted_score >= 0.60:
            overall_pred_level = "HIGH"
        elif max_predicted_score >= 0.35:
            overall_pred_level = "MEDIUM"
        elif max_predicted_score >= 0.15:
            overall_pred_level = "LOW"
        else:
            overall_pred_level = "SAFE"

        # 4. Synthesize final summaries
        final_count = projections[-1]["predicted_crowd_count"]
        pred_movement_summary = (
            f"Crowd movement style is classified as '{movement_trend}'. "
            f"Projected headcount will change from {initial_count} to {final_count} over the next 5 minutes. "
            f"{movement_detail}"
        )
        
        pred_risk_summary = (
            f"Predicted risk is expected to evolve from {initial_risk_level} to {overall_pred_level} "
            f"with a peak score of {max_predicted_score} over the 5-minute forecast window, "
            f"primarily driven by '{movement_trend}' dynamics and density changes."
        )

        simulation_result = {
            "forecast_duration_minutes": 5,
            "predicted_crowd_movement": pred_movement_summary,
            "predicted_risk": pred_risk_summary,
            "overall_predicted_risk_level": overall_pred_level,
            "overall_predicted_risk_score": max_predicted_score,
            "minute_by_minute_projections": projections
        }

        logger.info(
            f"Rule-based crowd simulation complete: overall_predicted_risk={overall_pred_level}, "
            f"max_predicted_score={max_predicted_score}"
        )

        return simulation_result
