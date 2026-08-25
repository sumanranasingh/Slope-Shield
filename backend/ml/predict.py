"""
Slope-Shield AI — ML Prediction Interface
Loads serialized Random Forest model and performs inference with feature attributions.
"""
import os
import logging
from typing import Dict, Any, Tuple
import numpy as np
import joblib

from ml.preprocessing import (
    FEATURE_COLUMNS,
    extract_feature_vector,
    calculate_shap_like_importance,
)

logger = logging.getLogger(__name__)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "risk_model_v01.joblib")
_MODEL_CACHE = None


def load_model():
    """Load cached model artifact."""
    global _MODEL_CACHE
    if _MODEL_CACHE is None:
        if os.path.exists(MODEL_PATH):
            try:
                _MODEL_CACHE = joblib.load(MODEL_PATH)
                logger.info(f"Loaded ML model from {MODEL_PATH} (Version: {_MODEL_CACHE.get('version')})")
            except Exception as e:
                logger.error(f"Failed to load ML model artifact: {e}")
                _MODEL_CACHE = None
        else:
            logger.warning(f"ML model artifact not found at {MODEL_PATH}")
            _MODEL_CACHE = None
    return _MODEL_CACHE


def predict_landslide_risk(raw_features: Dict[str, Any]) -> Dict[str, Any]:
    """
    Perform inference using Random Forest model or rule-based fallback.
    Returns:
      - risk_score: float (0-100)
      - risk_level: 'Low' | 'Moderate' | 'High' | 'Critical'
      - risk_probability: float (0-1)
      - risk_factors: list of feature contributions
      - model_version: string
    """
    vector = extract_feature_vector(raw_features)
    X = vector.reshape(1, -1)
    model = load_model()

    if model is not None and "regressor" in model and "classifier" in model:
        reg = model["regressor"]
        clf = model["classifier"]
        version = model.get("version", "rf-ner-v1.0")

        # Regressor score
        raw_score = float(reg.predict(X)[0])
        risk_score = round(max(0.0, min(100.0, raw_score)), 1)

        # Classifier probability
        classes = list(clf.classes_)
        probs = clf.predict_proba(X)[0]
        prob_dict = dict(zip(classes, probs))

        # Determine level
        if risk_score >= 80.0:
            level = "Critical"
        elif risk_score >= 60.0:
            level = "High"
        elif risk_score >= 40.0:
            level = "Moderate"
        else:
            level = "Low"

        critical_high_prob = float(prob_dict.get("Critical", 0.0) + prob_dict.get("High", 0.0))
        probability = round(min(1.0, max(0.05, risk_score / 100.0 * 0.7 + critical_high_prob * 0.3)), 3)
    else:
        # Fallback calculation if model file not present yet
        version = "rule-v0.1-fallback"
        f_rain = min(float(raw_features.get("rainfall_72h", 0.0)) / 350.0, 1.0) * 0.3
        f_soil = min(float(raw_features.get("soil_moisture", 0.0)) / 100.0, 1.0) * 0.25
        f_slope = min(float(raw_features.get("slope_degree", 0.0)) / 50.0, 1.0) * 0.25
        f_disp = min(float(raw_features.get("ground_movement", 0.0)) / 15.0, 1.0) * 0.2
        raw_score = (f_rain + f_soil + f_slope + f_disp) * 100.0
        risk_score = round(min(max(raw_score, 0.0), 100.0), 1)

        if risk_score >= 80.0: level = "Critical"
        elif risk_score >= 60.0: level = "High"
        elif risk_score >= 40.0: level = "Moderate"
        else: level = "Low"
        probability = round(risk_score / 100.0, 3)

    factors = calculate_shap_like_importance(vector, FEATURE_COLUMNS)

    return {
        "risk_score": risk_score,
        "risk_level": level,
        "risk_probability": probability,
        "risk_factors": factors,
        "model_version": version,
    }
