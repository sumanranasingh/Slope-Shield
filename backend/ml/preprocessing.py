"""
Slope-Shield AI — ML Feature Preprocessing & Pipeline Utilities
Handles feature transformation, normalization, and validation for landslide susceptibility.
"""
from typing import Dict, List, Any, Tuple
import numpy as np

# Canonical feature list expected by the Random Forest model
FEATURE_COLUMNS = [
    "rainfall_24h",
    "rainfall_72h",
    "rainfall_7d",
    "soil_moisture",
    "temperature",
    "humidity",
    "slope_degree",
    "elevation",
    "historical_landslide_count",
    "distance_to_road",
    "distance_to_drainage",
    "land_cover_code",
    "geological_factor",
    "ground_movement",
]

LAND_COVER_MAPPING = {
    "Forest": 0.3,
    "Dense Forest": 0.25,
    "Sparse Forest": 0.45,
    "Barren": 0.9,
    "Urban": 0.55,
    "Agriculture": 0.6,
    "Grassland": 0.4,
    "Alpine Meadow": 0.5,
}

def encode_land_cover(land_cover: str) -> float:
    """Encode land cover category to empirical runoff/soil-retention susceptibility factor."""
    return LAND_COVER_MAPPING.get(land_cover, 0.5)

def extract_feature_vector(raw_features: Dict[str, Any]) -> np.ndarray:
    """Convert input dictionary to numeric 1D numpy array."""
    lc = raw_features.get("land_cover", "Forest")
    lc_code = encode_land_cover(lc) if isinstance(lc, str) else float(lc)

    vector = [
        float(raw_features.get("rainfall_24h", 0.0)),
        float(raw_features.get("rainfall_72h", 0.0)),
        float(raw_features.get("rainfall_7d", 0.0)),
        float(raw_features.get("soil_moisture", 0.0)),
        float(raw_features.get("temperature", 20.0)),
        float(raw_features.get("humidity", 70.0)),
        float(raw_features.get("slope_degree", 25.0)),
        float(raw_features.get("elevation", 1000.0)),
        float(raw_features.get("historical_landslide_count", 0)),
        float(raw_features.get("distance_to_road", 1.0)),
        float(raw_features.get("distance_to_drainage", 1.0)),
        lc_code,
        float(raw_features.get("geological_factor", 0.5)),
        float(raw_features.get("ground_movement", 0.0)),
    ]
    return np.array(vector, dtype=np.float32)

def calculate_shap_like_importance(
    feature_vector: np.ndarray,
    feature_names: List[str] = FEATURE_COLUMNS
) -> List[Dict[str, Any]]:
    """
    Generate intuitive factor contributions based on normalized deviation from safe baseline.
    """
    # Baseline nominal values (safe thresholds)
    baselines = {
        "rainfall_24h": 20.0,
        "rainfall_72h": 50.0,
        "rainfall_7d": 100.0,
        "soil_moisture": 40.0,
        "temperature": 22.0,
        "humidity": 60.0,
        "slope_degree": 20.0,
        "elevation": 1000.0,
        "historical_landslide_count": 0.0,
        "distance_to_road": 2.0,       # closer = higher risk
        "distance_to_drainage": 2.0,   # closer = higher risk
        "land_cover_code": 0.3,
        "geological_factor": 0.4,
        "ground_movement": 1.0,
    }

    display_labels = {
        "rainfall_72h": ("Cumulative 72h Rainfall", "#3b82f6"),
        "rainfall_24h": ("24h Rainfall Intensity", "#06b6d4"),
        "soil_moisture": ("Soil Saturation Level", "#8b5cf6"),
        "slope_degree": ("Terrain Slope Gradient", "#f59e0b"),
        "historical_landslide_count": ("Historical Landslide Frequency", "#ef4444"),
        "geological_factor": ("Geological / Rock Instability", "#ec4899"),
        "ground_movement": ("InSAR Ground Displacement", "#14b8a6"),
        "distance_to_road": ("Road Cut Proximity", "#f97316"),
        "land_cover_code": ("Vegetation Cover / Degradation", "#10b981"),
        "rainfall_7d": ("Antecedent 7-Day Rainfall", "#6366f1"),
        "humidity": ("Atmospheric Humidity", "#a855f7"),
        "elevation": ("High-Altitude Morphometry", "#64748b"),
        "distance_to_drainage": ("Drainage Channel Proximity", "#0284c7"),
        "temperature": ("Thermal Fluctuations", "#94a3b8"),
    }

    weights = {
        "rainfall_72h": 0.22,
        "rainfall_24h": 0.16,
        "soil_moisture": 0.15,
        "slope_degree": 0.13,
        "historical_landslide_count": 0.10,
        "geological_factor": 0.08,
        "ground_movement": 0.07,
        "distance_to_road": 0.05,
        "land_cover_code": 0.04,
    }

    contributions = []
    for name, weight in weights.items():
        idx = feature_names.index(name)
        val = feature_vector[idx]
        base = baselines[name]

        if name in ("distance_to_road", "distance_to_drainage"):
            # closer is worse
            dev = max(0.0, 1.0 - (val / 3.0))
        else:
            dev = max(0.0, (val - base) / max(base, 1.0))

        contrib = weight * min(dev, 3.0)
        label, color = display_labels.get(name, (name, "#3b82f6"))
        contributions.append({
            "name": label,
            "raw_name": name,
            "score": contrib,
            "color": color,
        })

    total = float(sum(c["score"] for c in contributions) or 1.0)
    result = [
        {
            "name": str(c["name"]),
            "contribution": float(round((float(c["score"]) / total) * 100.0, 1)),
            "color": str(c["color"]),
        }
        for c in sorted(contributions, key=lambda x: -x["score"])
    ]
    return result
