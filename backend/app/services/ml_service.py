"""
Slope-Shield AI — ML Service Layer
Connects FastAPI request pipelines with the trained Machine Learning Risk Model.
"""
import logging
from typing import Dict, Any, List
from ml.predict import predict_landslide_risk, load_model

logger = logging.getLogger(__name__)


class MLService:
    def __init__(self):
        self._model = load_model()

    def predict(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Run inference using the machine learning pipeline.
        Generates risk score, probability, risk level, and explainable feature attributions.
        """
        try:
            result = predict_landslide_risk(features)
            return result
        except Exception as e:
            logger.error(f"Error executing ML inference: {e}", exc_info=True)
            # Safe deterministic baseline
            return {
                "risk_score": 45.0,
                "risk_level": "Moderate",
                "risk_probability": 0.45,
                "risk_factors": [],
                "model_version": "fallback-safe",
            }

    def get_model_metadata(self) -> Dict[str, Any]:
        """Return information about the currently loaded ML model."""
        model = load_model()
        if model is None:
            return {
                "status": "fallback_rule_engine",
                "version": "rule-v0.1-dev",
                "trained_at": None,
                "metrics": {},
            }
        return {
            "status": "active",
            "version": model.get("version", "rf-ner-v1.0"),
            "trained_at": model.get("trained_at"),
            "metrics": model.get("metrics", {}),
            "feature_importances": model.get("feature_importances", {}),
        }


ml_service = MLService()
