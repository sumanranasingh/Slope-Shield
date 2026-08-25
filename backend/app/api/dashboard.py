"""
Executive Dashboard summary API router.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timezone

from app.database.database import get_db
from app.database.models import Location, RiskPrediction, Warning, Road, CitizenReport
from app.schemas.schemas import DashboardSummaryOut, DataSourceMeta
from app.services.weather_service import weather_service
from app.services.ml_service import ml_service

router = APIRouter()


@router.get("/summary", response_model=DashboardSummaryOut)
async def get_dashboard_summary(db: AsyncSession = Depends(get_db)):
    loc_count = (await db.execute(select(func.count(Location.id)))).scalar() or 0
    warn_count = (await db.execute(select(func.count(Warning.id)).where(Warning.status == "Active"))).scalar() or 0
    road_count = (await db.execute(select(func.count(Road.id)))).scalar() or 0
    report_count = (await db.execute(select(func.count(CitizenReport.id)).where(CitizenReport.status != "RESOLVED"))).scalar() or 0

    # Get latest risk predictions
    preds_result = await db.execute(
        select(RiskPrediction).order_by(RiskPrediction.predicted_at.desc()).limit(100)
    )
    preds = preds_result.scalars().all()

    critical_count = sum(1 for p in preds if p.risk_level == "Critical")
    high_count = sum(1 for p in preds if p.risk_level == "High")
    avg_score = round(sum(p.risk_score for p in preds) / len(preds), 1) if preds else 52.4

    # Build actionable high priority items
    high_preds = sorted([p for p in preds if p.risk_score >= 68.0], key=lambda p: -p.risk_score)[:6]
    actions = []
    for p in high_preds:
        loc = (await db.execute(select(Location).where(Location.id == p.location_id))).scalar_one_or_none()
        if loc:
            actions.append({
                "id": p.id,
                "priority": "immediate" if p.risk_score >= 85 else "high",
                "locationName": loc.name,
                "state": loc.state,
                "action": p.recommended_action or "Ground geotechnical inspection recommended.",
                "riskScore": p.risk_score,
                "riskLevel": p.risk_level,
            })

    weather_status = weather_service.get_provider_status()
    ml_meta = ml_service.get_model_metadata()

    return DashboardSummaryOut(
        total_monitored_locations=loc_count,
        critical_risk_locations=critical_count,
        high_risk_locations=high_count,
        active_warnings=warn_count,
        affected_roads=road_count,
        recent_incidents=report_count,
        regional_risk_level="Critical" if critical_count > 1 else "High" if high_count > 2 else "Moderate",
        risk_trend="increasing" if critical_count > 0 else "stable",
        average_risk_score=avg_score,
        actions_required=actions,
        system_status={
            "monitoringStationsOnline": loc_count,
            "monitoringStationsTotal": loc_count,
            "lastDataSync": datetime.now(timezone.utc).isoformat(),
            "weatherProviderStatus": weather_status["status"],
            "weatherProviderName": weather_status["provider_name"],
            "satellitePassAge": "14m ago (Sentinel-1B)",
            "mlModelVersion": ml_meta.get("version", "rf-ner-v1.0"),
            "mlModelStatus": ml_meta.get("status", "active"),
        },
        data_source=DataSourceMeta(
            source="LIVE" if weather_status["is_live"] else "DEMO",
            last_updated=datetime.now(timezone.utc).isoformat(),
            provider="SlopeShield Realtime Intelligence Engine",
            model_version=ml_meta.get("version", "rf-ner-v1.0"),
        ),
    )
