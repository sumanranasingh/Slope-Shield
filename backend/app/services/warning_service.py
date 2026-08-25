"""
Slope-Shield AI — Early Warning & CAP Protocol Engine
Evaluates telemetry, ML predictions, rainfall thresholds, and triggers automated warnings
with deduplication and cooldown management.
"""
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone, timedelta
import logging

logger = logging.getLogger(__name__)


class WarningService:
    def __init__(self):
        # In-memory cooldown cache: {location_id: (last_warning_time, severity)}
        self._cooldown_cache: Dict[str, Tuple_Type] = {}

    @staticmethod
    def evaluate_risk_for_warning(
        location_name: str,
        state: str,
        risk_score: float,
        rainfall_24h: float,
        slope_degree: float,
        soil_moisture: float,
        affected_population: int = 1500,
        location_id: Optional[str] = None,
        existing_active_warning: Optional[Dict[str, Any]] = None,
    ) -> Optional[Dict[str, Any]]:
        """
        Evaluate physical conditions against statutory hazard thresholds with deduplication & cooldown.
        Returns warning dictionary if conditions trigger an alert.
        """
        severity = None
        trigger_reasons = []

        if risk_score >= 80 or (rainfall_24h > 150 and slope_degree > 35) or soil_moisture > 90:
            severity = "Critical"
            if rainfall_24h > 150: trigger_reasons.append(f"Extreme 24h precipitation ({rainfall_24h:.0f}mm)")
            if soil_moisture > 90: trigger_reasons.append("Critical soil pore water saturation (>90%)")
            if slope_degree > 35: trigger_reasons.append(f"Steep slope geometry ({slope_degree:.0f}°)")
            if risk_score >= 80: trigger_reasons.append(f"ML Risk Index: {risk_score:.0f}/100")
        elif risk_score >= 60 or (rainfall_24h > 100 and slope_degree > 30):
            severity = "High"
            if rainfall_24h > 100: trigger_reasons.append(f"Heavy 24h rainfall ({rainfall_24h:.0f}mm)")
            if soil_moisture > 75: trigger_reasons.append("Elevated soil moisture (>75%)")
            if risk_score >= 60: trigger_reasons.append(f"ML Risk Index: {risk_score:.0f}/100")
        elif risk_score >= 40 or rainfall_24h > 60:
            severity = "Moderate"
            trigger_reasons.append(f"Moderate precipitation and slope sensitivity")

        if not severity:
            return None

        # Deduplication check: if there is already an active warning with the same or higher severity, do not duplicate
        if existing_active_warning:
            curr_sev = existing_active_warning.get("severity")
            sev_rank = {"Critical": 3, "High": 2, "Moderate": 1, "Low": 0}
            if sev_rank.get(curr_sev, 0) >= sev_rank.get(severity, 0):
                logger.debug(f"Warning deduplicated: Location {location_name} already has active {curr_sev} warning.")
                return None

        trigger_str = " + ".join(trigger_reasons)
        rec_action = (
            f"IMMEDIATE ACTION: Issue Level 3 RED Advisory. Activate Emergency Operations Center (EOC) for {state}. "
            f"Pre-position SDRF rescue units, notify BRO/NHIDCL for highway closures, and initiate precautionary evacuation."
            if severity == "Critical"
            else f"URGENT: Issue Level 2 ORANGE Alert. Conduct rapid geotechnical ground inspection within 24h. Restrict night heavy vehicle traffic."
            if severity == "High"
            else "ADVISORY: Issue Level 1 YELLOW Notice. Increase telemetry frequency and inspect drainage channels."
        )

        return {
            "severity": severity,
            "location_id": location_id or "",
            "location_name": location_name,
            "state": state,
            "risk_score": risk_score,
            "risk_probability": round(risk_score / 100.0, 2),
            "trigger": trigger_str,
            "message": f"{severity.upper()} Landslide Warning issued for {location_name}, {state} due to {trigger_str}.",
            "recommended_action": rec_action,
            "affected_area": f"{location_name} sector (approx 5km corridor)",
            "affected_population": affected_population,
            "issued_by": "SlopeShield Automated Warning Engine",
            "cap_event": "Landslide Hazard Advisory",
            "cap_urgency": "Immediate" if severity == "Critical" else "Expected",
            "cap_certainty": "Observed" if severity == "Critical" else "Likely",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "expires_at": (datetime.now(timezone.utc) + timedelta(hours=48 if severity == "Critical" else 72)).isoformat(),
        }


warning_service = WarningService()
