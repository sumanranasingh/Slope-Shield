"""
Risk Prediction & Machine Learning Inference API router.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timezone
import json

from app.database.database import get_db
from app.database.models import RiskPrediction, Location
from app.schemas.schemas import PredictRiskIn, PredictRiskOut, RiskFactorOut, DataSourceMeta
from app.services.ml_service import ml_service
from app.services.risk_engine import compute_risk

router = APIRouter()


@router.post("/predict-risk", response_model=PredictRiskOut)
async def predict_risk(body: PredictRiskIn, db: AsyncSession = Depends(get_db)):
    """
    Evaluates risk features through the Random Forest ML pipeline,
    computes feature importances and domain-specific mitigation steps,
    and records the prediction for spatial telemetry tracking.
    """
    raw_dict = body.model_dump()
    ml_result = ml_service.predict(raw_dict)

    # Compute physical explanations and actionable advice
    engine_result = compute_risk(
        rainfall_24h=body.rainfall_24h,
        rainfall_72h=body.rainfall_72h,
        rainfall_7d=body.rainfall_7d,
        soil_moisture=body.soil_moisture,
        temperature=body.temperature,
        humidity=body.humidity,
        slope_degree=body.slope_degree,
        elevation=body.elevation,
        historical_landslide_count=body.historical_landslide_count,
        distance_to_road=body.distance_to_road,
        distance_to_drainage=body.distance_to_drainage,
        land_cover=body.land_cover,
        geological_factor=body.geological_factor,
        ground_movement=body.ground_movement,
    )

    # Combine ML probability with domain explanations
    factors = [RiskFactorOut(**f) for f in ml_result.get("risk_factors", [])]
    if not factors:
        factors = [RiskFactorOut(**f) for f in engine_result.get("risk_factors", [])]

    # Save prediction history if location is specified
    if body.location_id:
        pred_record = RiskPrediction(
            location_id=body.location_id,
            risk_score=ml_result["risk_score"],
            risk_level=ml_result["risk_level"],
            risk_probability=ml_result["risk_probability"],
            rainfall_24h=body.rainfall_24h,
            rainfall_72h=body.rainfall_72h,
            rainfall_7d=body.rainfall_7d,
            soil_moisture=body.soil_moisture,
            temperature=body.temperature,
            humidity=body.humidity,
            ground_movement=body.ground_movement,
            recommended_action=engine_result["recommended_action"],
            explanation=json.dumps([f.model_dump() for f in factors]),
            model_version=ml_result["model_version"],
            predicted_at=datetime.now(timezone.utc),
        )
        db.add(pred_record)
        await db.commit()

    return PredictRiskOut(
        risk_score=ml_result["risk_score"],
        risk_level=ml_result["risk_level"],
        risk_probability=ml_result["risk_probability"],
        risk_factors=factors,
        recommended_action=engine_result["recommended_action"],
        explanation=engine_result["explanation"],
        model_version=ml_result["model_version"],
        prediction_timestamp=datetime.now(timezone.utc).isoformat(),
        data_source=DataSourceMeta(
            source="DEMO",
            model_version=ml_result["model_version"],
            provider="SlopeShield Random Forest Pipeline",
            last_updated=datetime.now(timezone.utc).isoformat(),
        ),
    )
