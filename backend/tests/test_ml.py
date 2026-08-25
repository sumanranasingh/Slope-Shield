"""
Unit tests for Machine Learning Pipeline and Feature Importance extraction.
"""
import pytest
from ml.predict import predict_landslide_risk, load_model
from ml.preprocessing import extract_feature_vector, FEATURE_COLUMNS, calculate_shap_like_importance


def test_model_loading():
    model = load_model()
    assert model is not None
    assert "regressor" in model
    assert "classifier" in model
    assert model["version"] == "rf-ner-v1.0"


def test_feature_vector_extraction():
    raw = {
        "rainfall_24h": 120.0,
        "rainfall_72h": 280.0,
        "slope_degree": 40.0,
        "land_cover": "Dense Forest",
    }
    vec = extract_feature_vector(raw)
    assert len(vec) == len(FEATURE_COLUMNS)
    assert vec[0] == 120.0
    assert vec[1] == 280.0


def test_ml_prediction_high_risk():
    high_risk_input = {
        "rainfall_24h": 180.0,
        "rainfall_72h": 360.0,
        "rainfall_7d": 580.0,
        "soil_moisture": 94.0,
        "temperature": 18.0,
        "humidity": 96.0,
        "slope_degree": 45.0,
        "elevation": 2400.0,
        "historical_landslide_count": 4,
        "distance_to_road": 0.2,
        "distance_to_drainage": 0.1,
        "land_cover": "Barren",
        "geological_factor": 0.9,
        "ground_movement": 16.0,
    }
    res = predict_landslide_risk(high_risk_input)
    assert res["risk_score"] >= 70.0
    assert res["risk_level"] in ("High", "Critical")
    assert res["risk_probability"] > 0.6
    assert len(res["risk_factors"]) > 0


def test_ml_prediction_low_risk():
    low_risk_input = {
        "rainfall_24h": 10.0,
        "rainfall_72h": 25.0,
        "rainfall_7d": 40.0,
        "soil_moisture": 35.0,
        "temperature": 24.0,
        "humidity": 55.0,
        "slope_degree": 12.0,
        "elevation": 300.0,
        "historical_landslide_count": 0,
        "distance_to_road": 2.5,
        "distance_to_drainage": 1.5,
        "land_cover": "Dense Forest",
        "geological_factor": 0.3,
        "ground_movement": 0.0,
    }
    res = predict_landslide_risk(low_risk_input)
    assert res["risk_score"] < 50.0
    assert res["risk_level"] in ("Low", "Moderate")
