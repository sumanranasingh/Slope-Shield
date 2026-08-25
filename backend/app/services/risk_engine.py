"""
Slope-Shield AI — Risk Engine
Rule-based risk scoring with ML-ready architecture.
Generates explainable risk predictions from environmental and terrain inputs.
"""
import math
from datetime import datetime, timezone
from typing import List, Tuple


MODEL_VERSION = "rule-v0.1-dev"


def compute_risk(
    rainfall_24h: float, rainfall_72h: float, rainfall_7d: float,
    soil_moisture: float, temperature: float, humidity: float,
    slope_degree: float, elevation: float,
    historical_landslide_count: int,
    distance_to_road: float, distance_to_drainage: float,
    land_cover: str, geological_factor: float,
    ground_movement: float,
) -> dict:
    """
    Compute risk score from physical features.
    Returns score, level, probability, factors, explanation, and recommended action.
    """
    # ── Factor scores (0–1 scale) ──────────────────────────────────
    f_rain24 = min(rainfall_24h / 200.0, 1.0)
    f_rain72 = min(rainfall_72h / 400.0, 1.0)
    f_rain7d = min(rainfall_7d / 800.0, 1.0)
    f_soil   = min(soil_moisture / 100.0, 1.0)
    f_slope  = min(slope_degree / 60.0, 1.0)
    f_elev   = min(elevation / 3000.0, 1.0) * 0.5  # moderate weight
    f_hist   = min(historical_landslide_count / 5.0, 1.0)
    f_road   = max(0, 1.0 - distance_to_road / 2.0)  # closer = higher
    f_drain  = max(0, 1.0 - distance_to_drainage / 1.0)
    f_geo    = min(geological_factor, 1.0)
    f_move   = min(ground_movement / 20.0, 1.0)
    f_humid  = min(humidity / 100.0, 1.0) * 0.3

    # Land cover factor
    lc_factors = {"Forest": 0.3, "Barren": 0.9, "Urban": 0.5, "Agriculture": 0.6, "Grassland": 0.4}
    f_lc = lc_factors.get(land_cover, 0.5)

    # ── Weighted combination ───────────────────────────────────────
    weights = {
        "rainfall_72h": 0.22, "rainfall_24h": 0.15, "soil_moisture": 0.14,
        "slope": 0.12, "historical": 0.10, "geological": 0.08,
        "ground_movement": 0.06, "road_proximity": 0.05,
        "drainage": 0.03, "land_cover": 0.03, "humidity": 0.02,
    }

    raw = (
        weights["rainfall_72h"] * f_rain72 +
        weights["rainfall_24h"] * f_rain24 +
        weights["soil_moisture"] * f_soil +
        weights["slope"] * f_slope +
        weights["historical"] * f_hist +
        weights["geological"] * f_geo +
        weights["ground_movement"] * f_move +
        weights["road_proximity"] * f_road +
        weights["drainage"] * f_drain +
        weights["land_cover"] * f_lc +
        weights["humidity"] * f_humid
    )

    score = round(min(max(raw * 100, 0), 100))
    probability = round(min(raw * 1.1, 1.0), 3)

    # Level
    if score >= 80: level = "Critical"
    elif score >= 60: level = "High"
    elif score >= 40: level = "Moderate"
    else: level = "Low"

    # ── Risk factors with contributions ────────────────────────────
    factor_values = [
        ("Cumulative 72h Rainfall", f_rain72 * weights["rainfall_72h"], "#3b82f6"),
        ("24h Rainfall Intensity", f_rain24 * weights["rainfall_24h"], "#06b6d4"),
        ("Soil Moisture / Saturation", f_soil * weights["soil_moisture"], "#8b5cf6"),
        ("Slope Gradient", f_slope * weights["slope"], "#f59e0b"),
        ("Historical Landslide Activity", f_hist * weights["historical"], "#ef4444"),
        ("Geological Instability", f_geo * weights["geological"], "#ec4899"),
        ("Ground Movement (InSAR)", f_move * weights["ground_movement"], "#14b8a6"),
        ("Road Proximity Exposure", f_road * weights["road_proximity"], "#f97316"),
    ]

    total_contrib = sum(v for _, v, _ in factor_values) or 1
    factors = [
        {"name": n, "contribution": round(v / total_contrib * 100, 1), "color": c}
        for n, v, c in sorted(factor_values, key=lambda x: -x[1])
    ]

    # ── Explanations from actual inputs ────────────────────────────
    explanations = []
    if rainfall_72h > 200: explanations.append(f"Very high 72-hour cumulative rainfall ({rainfall_72h:.0f} mm)")
    elif rainfall_72h > 100: explanations.append(f"High 72-hour cumulative rainfall ({rainfall_72h:.0f} mm)")
    if rainfall_24h > 100: explanations.append(f"Heavy 24-hour rainfall ({rainfall_24h:.0f} mm)")
    if soil_moisture > 80: explanations.append(f"Very high soil saturation ({soil_moisture:.0f}%)")
    elif soil_moisture > 60: explanations.append(f"Elevated soil moisture ({soil_moisture:.0f}%)")
    if slope_degree > 35: explanations.append(f"Steep terrain gradient ({slope_degree:.0f}°)")
    if historical_landslide_count > 0: explanations.append(f"Previous landslide activity recorded ({historical_landslide_count} events)")
    if ground_movement > 10: explanations.append(f"Significant ground movement detected ({ground_movement:.1f} mm)")
    if geological_factor > 0.7: explanations.append("Weak geological formation")
    if distance_to_road < 0.5: explanations.append("High road infrastructure exposure")
    if not explanations: explanations.append("No significant risk factors detected")

    # ── Recommended action ─────────────────────────────────────────
    if level == "Critical":
        action = "IMMEDIATE: Deploy field assessment team. Issue evacuation advisory for nearby settlements. Activate emergency road closure protocols. Notify SDMA and BRO."
    elif level == "High":
        action = "URGENT: Schedule geotechnical field inspection within 24 hours. Place road maintenance crews on standby. Monitor InSAR displacement data continuously."
    elif level == "Moderate":
        action = "MONITOR: Increase monitoring frequency. Review drainage systems. Schedule routine slope inspection. Track rainfall forecast for next 72 hours."
    else:
        action = "ROUTINE: Continue standard monitoring schedule. No immediate action required."

    return {
        "risk_score": score,
        "risk_level": level,
        "risk_probability": probability,
        "risk_factors": factors,
        "explanation": explanations,
        "recommended_action": action,
        "model_version": MODEL_VERSION,
        "prediction_timestamp": datetime.now(timezone.utc).isoformat(),
    }
