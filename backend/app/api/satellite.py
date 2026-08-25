"""
Satellite Earth Observation API router.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.database.database import get_db
from app.services.satellite_service import satellite_service
from app.schemas.schemas import DataSourceMeta

router = APIRouter()


@router.get("/anomalies")
async def get_satellite_anomalies():
    anomalies = satellite_service.get_active_anomalies()
    return {
        "anomalies": anomalies,
        "count": len(anomalies),
        "data_source": DataSourceMeta(
            source="DEMO",
            provider="Sentinel-1 InSAR & Sentinel-2 Optical Change Detection",
        ),
    }


@router.get("/{location_id}")
async def get_satellite_observations(location_id: str):
    obs = satellite_service.get_satellite_observations_for_location(location_id)
    return {
        "location_id": location_id,
        "observations": obs,
        "data_source": DataSourceMeta(
            source="DEMO",
            provider="Copernicus Sentinel / ISRO Earth Observation Hub",
        ),
    }
