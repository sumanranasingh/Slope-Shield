"""
Integration tests for FastAPI endpoints using TestClient.
"""
import pytest


def test_health_endpoint(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ("healthy", "degraded")
    assert "version" in data
    assert "components" in data
    assert "database" in data["components"]
    assert "ml_engine" in data["components"]


def test_dashboard_summary(client):
    response = client.get("/api/dashboard/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["total_monitored_locations"] > 0
    assert "actions_required" in data
    assert "system_status" in data


def test_get_locations(client):
    response = client.get("/api/locations")
    assert response.status_code == 200
    locs = response.json()
    assert len(locs) > 0
    assert "coordinates" in locs[0]
    assert "risk_score" in locs[0]


def test_get_location_details(client):
    locs_res = client.get("/api/locations")
    locs = locs_res.json()
    first_id = locs[0]["id"]
    response = client.get(f"/api/locations/{first_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == first_id
    assert "historical_events" in data
    assert "forecast" in data
    assert "sensors" in data


def test_location_analysis_pipeline(client):
    payload = {
        "query": "Sela Pass",
        "rainfall_multiplier": 1.2,
    }
    response = client.post("/api/locations/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "Sela Pass" in data["location_name"]
    assert data["risk_score"] > 0.0
    assert len(data["risk_factors"]) > 0
    assert len(data["nearby_infrastructure"]) > 0


def test_geocode_endpoint(client):
    response = client.get("/api/locations/geocode?q=Gangtok")
    assert response.status_code == 200
    data = response.json()
    assert data["found"] is True
    assert data["location"]["state"] == "Sikkim"


def test_predict_risk(client):
    payload = {
        "location_id": "loc-001",
        "rainfall_24h": 160.0,
        "rainfall_72h": 320.0,
        "rainfall_7d": 500.0,
        "soil_moisture": 92.0,
        "temperature": 20.0,
        "humidity": 95.0,
        "slope_degree": 42.0,
        "elevation": 2200.0,
        "historical_landslide_count": 3,
        "distance_to_road": 0.2,
        "distance_to_drainage": 0.1,
        "land_cover": "Dense Forest",
        "geological_factor": 0.85,
        "ground_movement": 12.5,
    }
    response = client.post("/api/predict-risk", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] >= 60.0
    assert data["risk_level"] in ("High", "Critical")
    assert len(data["risk_factors"]) > 0
    assert "recommended_action" in data


def test_warnings_workflow(client):
    # 1. Get warnings
    res = client.get("/api/warnings")
    assert res.status_code == 200
    warns = res.json()
    assert len(warns) > 0

    # 2. Create warning
    create_payload = {
        "location_id": "loc-002",
        "severity": "High",
        "message": "Heavy rainfall warning for Sela Pass sector",
        "recommended_action": "Deploy road maintenance crews",
        "affected_area": "Sela Pass approach corridor",
        "response_team": "BRO Task Force 14",
    }
    create_res = client.post("/api/warnings", json=create_payload)
    assert create_res.status_code == 201
    new_warn = create_res.json()
    warn_id = new_warn["id"]

    # 3. Acknowledge warning
    ack_res = client.post(f"/api/warnings/{warn_id}/acknowledge")
    assert ack_res.status_code == 200
    assert ack_res.json()["status"] == "Acknowledged"

    # 4. Escalate warning
    esc_res = client.post(f"/api/warnings/{warn_id}/escalate", json={
        "target_severity": "Critical",
        "escalation_reason": "Ground movement sensor triggered threshold alarm.",
        "dispatched_team": "SDRF Tactical Rescue Unit",
    })
    assert esc_res.status_code == 200
    assert esc_res.json()["status"] == "Escalated"
    assert esc_res.json()["severity"] == "Critical"

    # 5. Resolve warning
    res_res = client.post(f"/api/warnings/{warn_id}/resolve")
    assert res_res.status_code == 200
    assert res_res.json()["status"] == "Resolved"


def test_roads_api(client):
    res = client.get("/api/roads")
    assert res.status_code == 200
    roads = res.json()
    assert len(roads) > 0
    assert "highway_code" in roads[0]
    assert "priority" in roads[0]


def test_citizen_reports_workflow(client):
    payload = {
        "category": "crack_observed",
        "severity": "High",
        "description": "Tension cracks forming on road shoulder at Km 42.",
        "latitude": 27.534,
        "longitude": 92.122,
        "location_name": "Sela Pass Upper Cut",
        "reporter_name": "Field Inspector T. Dorjee",
        "reporter_phone": "+91-9988776655",
    }
    res = client.post("/api/reports", json=payload)
    assert res.status_code == 201
    report = res.json()
    assert report["status"] == "NEW"

    # Verify transition
    patch_res = client.patch(f"/api/reports/{report['id']}", json={"status": "VERIFIED"})
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "VERIFIED"


def test_analytics_api(client):
    res = client.get("/api/analytics/risk")
    assert res.status_code == 200
    data = response = res.json()
    assert "risk_distribution" in data
    assert "state_risk_data" in data
    assert "monthly_trend_data" in data
