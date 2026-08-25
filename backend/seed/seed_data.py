"""
Slope-Shield AI — Development Seed Data Generator
Comprehensive, realistic disaster management and geospatial dataset covering the 8 North Eastern States of India.
"""
import logging
import random
import json
from datetime import datetime, timezone, timedelta
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.database.models import (
    Organization, User, Location, RiskPrediction, Warning, Road,
    CitizenReport, WeatherObservation, SoilObservation,
    HistoricalLandslide, SatelliteObservation, Notification, ResponseAction
)
from app.services.risk_engine import compute_risk
from app.services.ml_service import ml_service

logger = logging.getLogger(__name__)


# ── Detailed North Eastern Locations Dataset (16 High-Vulnerability Sectors) ──
NER_LOCATIONS = [
    # Arunachal Pradesh
    ("loc-001", "Dibang Valley Sector", "Lower Dibang Valley", "Arunachal Pradesh", 28.6900, 95.7400, 2200, 42, "Dense Forest", "Metamorphic Schist", 0.88, 92.5, "Alert"),
    ("loc-002", "Sela Pass Approach", "West Kameng", "Arunachal Pradesh", 27.5340, 92.1220, 4170, 38, "Barren", "Glacial Moraine Complex", 0.82, 88.0, "Alert"),
    ("loc-003", "Bomdila Escarpment", "West Kameng", "Arunachal Pradesh", 27.2640, 92.4240, 2415, 35, "Dense Forest", "Gneissic Complex", 0.74, 94.0, "Monitoring"),
    # Manipur
    ("loc-004", "Noney Corridor", "Noney", "Manipur", 24.7950, 93.5980, 680, 44, "Sparse Forest", "Disang Shales & Flysch", 0.92, 91.0, "Alert"),
    ("loc-005", "Tupul Railway Yard", "Noney", "Manipur", 24.8100, 93.6120, 650, 40, "Barren", "Alluvial-Colluvial Overburden", 0.89, 90.5, "Alert"),
    # Assam
    ("loc-006", "Jatinga Lampu Ridge", "Dima Hasao", "Assam", 25.1320, 93.0340, 680, 36, "Dense Forest", "Barail Sandstone / Shale", 0.78, 86.0, "Alert"),
    ("loc-007", "Haflong Hill Cut", "Dima Hasao", "Assam", 25.1680, 93.0180, 680, 32, "Sparse Forest", "Surma Group Shale", 0.71, 89.0, "Monitoring"),
    # Meghalaya
    ("loc-008", "Umiam Cut Section", "Ri-Bhoi", "Meghalaya", 25.6540, 91.8920, 1010, 28, "Dense Forest", "Shillong Group Quartzite", 0.65, 95.0, "Monitoring"),
    ("loc-009", "Sohra Escarpment", "East Khasi Hills", "Meghalaya", 25.2880, 91.7320, 1484, 45, "Grassland", "Khasi Greenstone & Sandstone", 0.85, 93.0, "Alert"),
    # Sikkim
    ("loc-010", "Gangtok Bypass Corridor", "East Sikkim", "Sikkim", 27.3380, 88.6060, 1650, 38, "Urban", "Daling Group Phyllite", 0.81, 96.0, "Alert"),
    ("loc-011", "Mangan Highway Segment", "North Sikkim", "Sikkim", 27.5100, 88.5320, 1200, 42, "Dense Forest", "Lingtse Gneiss & Mica Schist", 0.86, 84.0, "Alert"),
    # Nagaland
    ("loc-012", "Kohima South Ridge", "Kohima", "Nagaland", 25.6740, 94.1100, 1444, 30, "Dense Forest", "Disang Flysch Sandstone", 0.72, 91.0, "Monitoring"),
    ("loc-013", "Dimapur Foothill Sector", "Dimapur", "Nagaland", 25.8960, 93.7280, 260, 18, "Agriculture", "Alluvial Terrace", 0.42, 98.0, "Active"),
    # Mizoram
    ("loc-014", "Aizawl Eastern Slope", "Aizawl", "Mizoram", 23.7270, 92.7180, 1132, 35, "Dense Forest", "Surma Group Sandstone", 0.76, 92.0, "Monitoring"),
    ("loc-015", "Lunglei Cut Section", "Lunglei", "Mizoram", 22.8860, 92.7360, 850, 33, "Dense Forest", "Barail Formation", 0.69, 87.0, "Monitoring"),
    # Tripura
    ("loc-016", "Jampui Hills Ridge", "North Tripura", "Tripura", 23.9500, 92.2800, 930, 26, "Dense Forest", "Tipam Sandstone", 0.52, 94.0, "Active"),
]


# ── Critical Transportation Corridors (Highways & Rails) ──
NER_ROADS = [
    ("rd-01", "NH-13", "Trans-Arunachal Sela Pass Highway", "Arunachal Pradesh", "Bhalukpong", "Tawang", 185.0, 86.0, "High", "Restricted", "Border Roads Organisation (BRO)", "2026-08-24T10:00:00"),
    ("rd-02", "NH-37", "Imphal-Silchar Highway (Noney Corridor)", "Manipur", "Jiribam", "Imphal", 120.0, 92.0, "Critical", "Closed", "NHIDCL Emergency Cell", "2026-08-24T12:30:00"),
    ("rd-03", "NH-10", "Sevoke-Gangtok Mountain Highway", "Sikkim", "Sevoke", "Gangtok", 112.0, 78.0, "High", "Restricted", "Project Swastik (BRO)", "2026-08-24T08:00:00"),
    ("rd-04", "NH-40", "Shillong-Dawki Strategic Corridor", "Meghalaya", "Shillong", "Dawki Border", 82.0, 64.0, "High", "Open", "Meghalaya State PWD", "2026-08-24T09:15:00"),
    ("rd-05", "NH-2", "Kohima-Imphal Highway", "Nagaland", "Kohima", "Imphal", 138.0, 71.0, "High", "Restricted", "NHIDCL", "2026-08-23T16:00:00"),
    ("rd-06", "NH-54", "Silchar-Aizawl Lifeline", "Mizoram", "Silchar", "Aizawl", 175.0, 68.0, "High", "Open", "Project Pushpak (BRO)", "2026-08-23T11:00:00"),
    ("rd-07", "NH-8", "Agartala-Churaibari Corridor", "Tripura", "Agartala", "Churaibari", 198.0, 38.0, "Low", "Open", "Tripura PWD (NH)", "2026-08-22T14:00:00"),
    ("rd-08", "NH-29", "Dimapur-Kohima 4-Lane Bypass", "Nagaland", "Dimapur", "Kohima", 68.0, 58.0, "Moderate", "Open", "NHIDCL", "2026-08-24T13:00:00"),
]


# ── Historical Major Landslide Activity Archive ──
HISTORICAL_EVENTS = [
    ("loc-004", "2022-06-29", "Catastrophic Debris Flow", "Critical", "Catastrophic Tupul railway yard debris flow triggered by monsoon cloudburst, destroying yard construction camp and viaduct piers with 62+ fatalities."),
    ("loc-006", "2024-05-18", "Rotational Bedding Slide", "High", "Massive slope failure along Jatinga-Haflong railway cutting, disrupting Lumding-Badarpur hill rail network for 45 days."),
    ("loc-010", "2023-10-04", "Rock & Debris Slide", "High", "Flash-flood induced slope toe scouring along Gangtok Bypass causing 48-hour total transit blockade."),
    ("loc-001", "2024-08-11", "Deep-Seated Valley Slide", "Critical", "Debris flow destroyed approach abutment of bridge across Dibang River, severing Anini district headquarters."),
    ("loc-002", "2023-08-22", "Rock Avalanche", "Major", "Jointed gneissic rock mass detachment on Sela approach road blocking military logistical convoy routes."),
    ("loc-009", "2022-06-17", "Escarpment Toe Failure", "High", "Continuous extreme precipitation (850mm / 48h) triggered multiple translational slides across Sohra-Shella road."),
]


async def seed_database(db: AsyncSession):
    """Seed comprehensive production-grade development dataset if empty."""
    loc_count = (await db.execute(select(func.count(Location.id)))).scalar() or 0
    if loc_count > 0:
        logger.info(f"Database already contains {loc_count} locations. Skipping seed.")
        return

    logger.info("Seeding Slope-Shield AI database with North Eastern Region dataset...")

    # 1. Organization
    org = Organization(
        id="org-001",
        name="National Disaster Management Authority — North Eastern Regional Office",
        type="SDMA / Central Command",
        region="North Eastern Region (NER)",
    )
    db.add(org)

    # 2. Users (Admin, District Officer, Field Officer, Analyst)
    users_data = [
        ("usr-001", "admin@slopeshield.ai", "Administrator", "admin", "org-001"),
        ("usr-002", "district.kameng@slopeshield.ai", "District Magistrate (West Kameng)", "district_officer", "org-001"),
        ("usr-003", "bro.officer@slopeshield.ai", "Major R. K. Nair (BRO TF-14)", "field_officer", "org-001"),
        ("usr-004", "geotech.analyst@slopeshield.ai", "Dr. S. Bannerjee (Senior Geologist)", "analyst", "org-001"),
    ]
    for uid, email, name, role, org_id in users_data:
        u = User(
            id=uid,
            email=email,
            hashed_password=hash_password("admin123"),
            name=name,
            role=role,
            organization_id=org_id,
            is_active=True,
            created_at=datetime.now(timezone.utc),
        )
        db.add(u)

    # 3. Locations and initial Risk Predictions
    for lid, name, dist, state, lat, lng, elev, slope, lc, geo, geofac, cov, status in NER_LOCATIONS:
        loc = Location(
            id=lid,
            name=name,
            district=dist,
            state=state,
            latitude=lat,
            longitude=lng,
            elevation=elev,
            slope=slope,
            land_cover=lc,
            geological_class=geo,
            geological_factor=geofac,
            data_coverage=cov,
            status=status,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(loc)

        # Baseline rainfall and geotechnical measurements
        # Make critical locations stand out realistically
        is_crit = lid in ("loc-001", "loc-004", "loc-002", "loc-006")
        r24 = round(random.uniform(140, 220) if is_crit else random.uniform(25, 95), 1)
        r72 = round(r24 * random.uniform(2.2, 3.4), 1)
        r7d = round(r72 * random.uniform(1.8, 2.6), 1)
        soil_m = round(random.uniform(82, 96) if is_crit else random.uniform(45, 75), 1)
        temp = round(random.uniform(16, 26), 1)
        humid = round(random.uniform(78, 98), 1)
        disp = round(random.uniform(8.0, 18.5) if is_crit else random.uniform(0.5, 4.0), 1)

        pred_res = ml_service.predict({
            "rainfall_24h": r24,
            "rainfall_72h": r72,
            "rainfall_7d": r7d,
            "soil_moisture": soil_m,
            "temperature": temp,
            "humidity": humid,
            "slope_degree": slope,
            "elevation": elev,
            "historical_landslide_count": 3 if is_crit else 1,
            "distance_to_road": 0.3 if is_crit else 1.5,
            "distance_to_drainage": 0.2,
            "land_cover": lc,
            "geological_factor": geofac,
            "ground_movement": disp,
        })

        rec_act = (
            f"IMMEDIATE ACTION: Deploy field stabilization team. Restrict heavy traffic. Coordinate with SDRF."
            if pred_res["risk_level"] == "Critical"
            else f"URGENT: Geotechnical inspection required within 24h. Monitor rainfall closely."
            if pred_res["risk_level"] == "High"
            else "ROUTINE: Normal telemetry monitoring."
        )

        pred = RiskPrediction(
            id=f"pred-{lid}",
            location_id=lid,
            risk_score=pred_res["risk_score"],
            risk_level=pred_res["risk_level"],
            risk_probability=pred_res["risk_probability"],
            rainfall_24h=r24,
            rainfall_72h=r72,
            rainfall_7d=r7d,
            soil_moisture=soil_m,
            temperature=temp,
            humidity=humid,
            ground_movement=disp,
            recommended_action=rec_act,
            explanation=json.dumps(pred_res["risk_factors"]),
            model_version=pred_res["model_version"],
            predicted_at=datetime.now(timezone.utc),
        )
        db.add(pred)

        # Weather Observation
        db.add(WeatherObservation(
            id=f"wobs-{lid}",
            location_id=lid,
            temperature=temp,
            humidity=humid,
            rainfall_1h=round(r24 / 12.0, 1),
            rainfall_24h=r24,
            rainfall_72h=r72,
            rainfall_7d=r7d,
            wind_speed=round(random.uniform(8, 35), 1),
            wind_direction="SW",
            pressure=1008.0,
            visibility=6.5,
            cloud_cover=90.0,
            condition="Heavy Monsoon Precipitation — Seed Baseline",
            observed_at=datetime.now(timezone.utc),
        ))

        # Soil Observation
        db.add(SoilObservation(
            id=f"sobs-{lid}",
            location_id=lid,
            soil_moisture=soil_m,
            pore_pressure=round(soil_m * 1.8, 1),
            soil_temperature=temp - 2.0,
            saturation_level="Critical" if soil_m > 85 else "Elevated" if soil_m > 65 else "Normal",
            observed_at=datetime.now(timezone.utc),
        ))

    # 4. Roads
    for rid, hcode, name, state, start, end, length, rscore, rlevel, status, auth, l_insp in NER_ROADS:
        db.add(Road(
            id=rid,
            highway_code=hcode,
            name=name,
            state=state,
            start_point=start,
            end_point=end,
            length_km=length,
            risk_score=rscore,
            risk_level=rlevel,
            status=status,
            authority=auth,
            last_inspected=datetime.fromisoformat(l_insp),
            created_at=datetime.now(timezone.utc),
        ))

    # 5. Historical Landslides
    for elid, edate, etype, esev, edesc in HISTORICAL_EVENTS:
        db.add(HistoricalLandslide(
            id=f"hist-{elid}-{edate[:4]}",
            location_id=elid,
            date=edate,
            type=etype,
            severity=esev,
            description=edesc,
        ))

    # 6. Active Early Warnings
    warnings_seed = [
        ("warn-01", "loc-004", "Noney Corridor", "Manipur", "Critical", 92.0, "Extreme 72h Rainfall (280mm) + Deep Disang Shale Instability", "CRITICAL RED ALERT: Active debris flow risk along Noney highway corridor. High vulnerability to railway cut stability.", "Deploy emergency assessment team. Issue traffic diversion via alternate routes.", "Noney & Tupul Sector (Km 35-58)", 4500, "BRO Task Force Alpha"),
        ("warn-02", "loc-001", "Dibang Valley Sector", "Arunachal Pradesh", "Critical", 88.0, "Prolonged high precipitation + InSAR LOS displacement -14.2cm", "CRITICAL RED ALERT: High velocity debris chute activation anticipated along Mayodia scarp.", "Initiate precautionary evacuation of lower valley settlements. Alert BRO.", "Lower Dibang Valley 5km radius", 1800, "SDRF Unit 3"),
        ("warn-03", "loc-009", "Sohra Escarpment", "Meghalaya", "High", 76.0, "High saturation (>90%) + steep cliff margin", "HIGH ORANGE ALERT: Tension cracks expanding along southern escarpment.", "Daily slope monitoring. Restrict heavy transit during night hours.", "Sohra-Shella link road", 3200, "PWD Quick Response Cell"),
        ("warn-04", "loc-011", "Mangan Highway Segment", "Sikkim", "High", 72.0, "Saturated phyllite bedrock failure risk", "HIGH ORANGE ALERT: Road cutting toe erosion on North Sikkim highway.", "Deploy JCB clearing equipment on standby.", "Mangan bypass sector", 2100, "BRO Project Swastik"),
    ]
    for wid, wlid, wname, wstate, wsev, wscore, wtrig, wmsg, wact, warea, wpop, wteam in warnings_seed:
        db.add(Warning(
            id=wid,
            location_id=wlid,
            location_name=wname,
            state=wstate,
            severity=wsev,
            risk_score=wscore,
            risk_probability=round(wscore / 100.0, 2),
            trigger=wtrig,
            message=wmsg,
            recommended_action=wact,
            affected_area=warea,
            affected_population=wpop,
            status="Active",
            issued_by="SlopeShield Warning Engine",
            response_team=wteam,
            created_at=datetime.now(timezone.utc) - timedelta(hours=random.randint(1, 12)),
            expires_at=datetime.now(timezone.utc) + timedelta(hours=48),
        ))

    # 7. Citizen and Field Reports
    reports_seed = [
        ("rpt-001", "landslide", "Critical", "Active debris flow observed near NH-13 Km 54, blocking one lane. Soil and rocks on road surface.", 27.534, 92.122, "Sela Pass Approach", "Arunachal Pradesh", "Capt. R. Singh (BRO)", "+91-9876543210", "VERIFIED", "Capt. R. Singh"),
        ("rpt-002", "crack_observed", "High", "Tension cracks noticed on hillside slope above railway track near Jatinga station.", 25.132, 93.034, "Jatinga Lampu Ridge", "Assam", "Field Engineer M. Bora", "+91-9876543211", "UNDER_REVIEW", None),
        ("rpt-003", "water_seepage", "Moderate", "Heavy water seepage from cut slope on NH-40 near Umiam. Road surface is wet and slippery.", 25.654, 91.892, "Umiam Cut Section", "Meghalaya", "PWD Inspector K. Lyngdoh", "+91-9876543212", "ACTIONED", "K. Lyngdoh"),
        ("rpt-004", "road_blockage", "Critical", "Complete road blockage due to debris at Noney corridor. No vehicular movement possible.", 24.795, 93.598, "Noney Corridor", "Manipur", "SDRF Team Lead", "+91-9876543213", "NEW", None),
        ("rpt-005", "subsidence", "High", "Road subsidence observed near Gangtok bypass road. Width of settlement approx 2m.", 27.338, 88.606, "Gangtok Bypass Corridor", "Sikkim", "District Engineer P. Tamang", "+91-9876543214", "RESOLVED", "P. Tamang"),
    ]
    for rpid, cat, sev, desc, lat, lng, loc_name, state, rep_name, rep_phone, status, vby in reports_seed:
        db.add(CitizenReport(
            id=rpid,
            category=cat,
            severity=sev,
            description=desc,
            latitude=lat,
            longitude=lng,
            location_name=loc_name,
            state=state,
            district="",
            reporter_name=rep_name,
            reporter_phone=rep_phone,
            reporter_role="Field Officer / Citizen",
            status=status,
            verified_by=vby,
            verified_at=datetime.now(timezone.utc) - timedelta(hours=4) if vby else None,
            created_at=datetime.now(timezone.utc) - timedelta(hours=random.randint(2, 24)),
        ))

    # 8. Satellite Observations
    for lid in ["loc-001", "loc-002", "loc-004", "loc-006", "loc-010"]:
        db.add(SatelliteObservation(
            id=f"satobs-{lid}-1",
            location_id=lid,
            source="Sentinel-1B (Ascending Track 121)",
            observation_type="InSAR Phase Decorrelation",
            resolution="10m",
            displacement_cm=-14.2 if lid == "loc-001" else -19.6 if lid == "loc-004" else -6.5,
            confidence=0.89,
            area_hectares=2.5,
            observed_at=datetime.now(timezone.utc) - timedelta(hours=14),
        ))

    await db.commit()
    logger.info(f"Database seeded successfully with {len(NER_LOCATIONS)} locations, {len(NER_ROADS)} highway corridors, {len(warnings_seed)} warnings.")
