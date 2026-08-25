"""
Unit tests for Business & Intelligence Services.
"""
import pytest
import asyncio
from app.services.warning_service import warning_service
from app.services.gis_service import gis_service
from app.services.weather_service import weather_service
from app.services.report_service import report_service


def test_warning_engine_evaluation():
    alert = warning_service.evaluate_risk_for_warning(
        location_name="Noney Corridor",
        state="Manipur",
        risk_score=88.0,
        rainfall_24h=175.0,
        slope_degree=44.0,
        soil_moisture=92.0,
    )
    assert alert is not None
    assert alert["severity"] == "Critical"
    assert "CAP" in alert["issued_by"] or "Warning" in alert["issued_by"]
    assert "RED" in alert["recommended_action"]


def test_gis_service_nearby_infrastructure():
    nearby = gis_service.get_nearby_infrastructure(27.534, 92.122, radius_km=50.0)
    assert len(nearby) > 0
    assert any("NH-13" in item["code"] for item in nearby)


def test_report_service_transitions():
    assert report_service.validate_transition("NEW", "UNDER_REVIEW") is True
    assert report_service.validate_transition("UNDER_REVIEW", "VERIFIED") is True
    assert report_service.validate_transition("RESOLVED", "NEW") is False


def test_weather_service_fallback():
    weather = asyncio.run(weather_service.get_current_weather(27.5, 92.5, "loc-test"))
    assert "temperature" in weather
    assert "rainfall_24h" in weather
    assert weather["source"] in ("LIVE", "DEMO")
