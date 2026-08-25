"""
Weather and Atmospheric Telemetry API router.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone

from app.database.database import get_db
from app.database.models import Location, WeatherObservation
from app.schemas.schemas import WeatherOut, DataSourceMeta
from app.services.weather_service import weather_service

router = APIRouter()


@router.get("/{location_id}", response_model=WeatherOut)
async def get_weather(location_id: str, db: AsyncSession = Depends(get_db)):
    loc = (await db.execute(select(Location).where(Location.id == location_id))).scalar_one_or_none()
    lat = loc.latitude if loc else 27.5
    lon = loc.longitude if loc else 92.5

    data = await weather_service.get_current_weather(lat, lon, location_id)
    return WeatherOut(
        location_id=location_id,
        timestamp=data.get("observed_at", datetime.now(timezone.utc).isoformat()),
        temperature=data.get("temperature", 22.0),
        humidity=data.get("humidity", 85.0),
        rainfall_1h=data.get("rainfall_1h", 5.0),
        rainfall_24h=data.get("rainfall_24h", 65.0),
        rainfall_72h=data.get("rainfall_72h", 140.0),
        condition=data.get("condition", "Monsoon Precipitation"),
        data_source=DataSourceMeta(
            source=data.get("source", "DEMO"),
            provider=data.get("provider", "Weather Service"),
            last_updated=datetime.now(timezone.utc).isoformat(),
        ),
    )


@router.get("/{location_id}/forecast")
async def get_forecast(location_id: str, db: AsyncSession = Depends(get_db)):
    loc = (await db.execute(select(Location).where(Location.id == location_id))).scalar_one_or_none()
    lat = loc.latitude if loc else 27.5
    lon = loc.longitude if loc else 92.5

    forecast_items = await weather_service.get_forecast(lat, lon, location_id)
    return {
        "location_id": location_id,
        "forecast": forecast_items,
        "data_source": DataSourceMeta(
            source="FORECAST",
            provider="Precipitation Hydrological Forecast",
            last_updated=datetime.now(timezone.utc).isoformat(),
        ),
    }
