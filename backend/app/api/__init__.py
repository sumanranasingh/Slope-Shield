"""
API router package for Slope-Shield AI.
"""
from fastapi import APIRouter
from app.api.auth import router as auth_router
from app.api.dashboard import router as dashboard_router
from app.api.locations import router as locations_router
from app.api.predictions import router as predictions_router
from app.api.weather import router as weather_router
from app.api.warnings import router as warnings_router
from app.api.roads import router as roads_router
from app.api.reports import router as reports_router
from app.api.satellite import router as satellite_router
from app.api.analytics import router as analytics_router

api_router = APIRouter(prefix="/api")

api_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
api_router.include_router(dashboard_router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(locations_router, prefix="/locations", tags=["Locations"])
api_router.include_router(predictions_router, tags=["Predictions"])
api_router.include_router(weather_router, prefix="/weather", tags=["Weather"])
api_router.include_router(warnings_router, prefix="/warnings", tags=["Warnings"])
api_router.include_router(roads_router, prefix="/roads", tags=["Roads"])
api_router.include_router(reports_router, prefix="/reports", tags=["Reports"])
api_router.include_router(satellite_router, prefix="/satellite", tags=["Satellite"])
api_router.include_router(analytics_router, prefix="/analytics", tags=["Analytics"])

__all__ = ["api_router"]
