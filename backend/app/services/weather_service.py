"""
Slope-Shield AI — Weather Provider Architecture
Supports multi-provider weather fetching with real-time API integrations and clean development fallbacks.
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List
from datetime import datetime, timezone
import httpx
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


class BaseWeatherProvider(ABC):
    @abstractmethod
    async def get_current_weather(self, lat: float, lon: float, location_id: str) -> Dict[str, Any]:
        """Fetch current atmospheric & precipitation observation."""
        pass

    @abstractmethod
    async def get_forecast(self, lat: float, lon: float, location_id: str) -> List[Dict[str, Any]]:
        """Fetch multi-day rainfall & temperature forecast."""
        pass


class OpenWeatherMapProvider(BaseWeatherProvider):
    def __init__(self, api_key: str, base_url: str):
        self.api_key = api_key
        self.base_url = base_url

    async def get_current_weather(self, lat: float, lon: float, location_id: str) -> Dict[str, Any]:
        url = f"{self.base_url}/data/2.5/weather"
        params = {"lat": lat, "lon": lon, "appid": self.api_key, "units": "metric"}
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()
            rain_1h = data.get("rain", {}).get("1h", 0.0)
            return {
                "location_id": location_id,
                "temperature": data.get("main", {}).get("temp", 22.0),
                "humidity": data.get("main", {}).get("humidity", 80.0),
                "rainfall_1h": rain_1h,
                "rainfall_24h": rain_1h * 12.0,  # estimated if only 1h available
                "rainfall_72h": rain_1h * 24.0,
                "condition": data.get("weather", [{}])[0].get("description", "Cloudy").title(),
                "observed_at": datetime.now(timezone.utc).isoformat(),
                "source": "LIVE",
                "provider": "OpenWeatherMap API",
            }

    async def get_forecast(self, lat: float, lon: float, location_id: str) -> List[Dict[str, Any]]:
        url = f"{self.base_url}/data/2.5/forecast"
        params = {"lat": lat, "lon": lon, "appid": self.api_key, "units": "metric"}
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()
            forecasts = []
            for item in data.get("list", [])[:8]:  # 24-hour steps
                forecasts.append({
                    "timestamp": item.get("dt_txt"),
                    "temperature": item.get("main", {}).get("temp"),
                    "humidity": item.get("main", {}).get("humidity"),
                    "rainfall_3h": item.get("rain", {}).get("3h", 0.0),
                    "condition": item.get("weather", [{}])[0].get("description", "").title(),
                })
            return forecasts


class DevelopmentWeatherProvider(BaseWeatherProvider):
    """
    Clearly labeled Development Seed Data provider.
    Never pretends to be a live external API when no key is set.
    """
    async def get_current_weather(self, lat: float, lon: float, location_id: str) -> Dict[str, Any]:
        return {
            "location_id": location_id,
            "temperature": 23.5,
            "humidity": 84.0,
            "rainfall_1h": 6.5,
            "rainfall_24h": 68.0,
            "rainfall_72h": 145.0,
            "condition": "Monsoon Heavy Showers — Development Baseline",
            "observed_at": datetime.now(timezone.utc).isoformat(),
            "source": "DEMO",
            "provider": "Development Geotechnical Telemetry Simulation",
        }

    async def get_forecast(self, lat: float, lon: float, location_id: str) -> List[Dict[str, Any]]:
        now = datetime.now(timezone.utc)
        return [
            {"hours_ahead": 24, "expected_rainfall_mm": 55.0, "risk_multiplier": 1.15, "confidence": 0.82, "source": "FORECAST"},
            {"hours_ahead": 48, "expected_rainfall_mm": 80.0, "risk_multiplier": 1.30, "confidence": 0.76, "source": "FORECAST"},
            {"hours_ahead": 72, "expected_rainfall_mm": 40.0, "risk_multiplier": 1.05, "confidence": 0.68, "source": "FORECAST"},
        ]


class WeatherService:
    def __init__(self):
        if settings.WEATHER_API_KEY:
            self.provider = OpenWeatherMapProvider(settings.WEATHER_API_KEY, settings.WEATHER_BASE_URL)
            self.is_live = True
        else:
            self.provider = DevelopmentWeatherProvider()
            self.is_live = False

    async def get_current_weather(self, lat: float, lon: float, location_id: str) -> Dict[str, Any]:
        try:
            return await self.provider.get_current_weather(lat, lon, location_id)
        except Exception as e:
            logger.warning(f"Live weather provider error: {e}. Using development fallback.")
            dev_provider = DevelopmentWeatherProvider()
            return await dev_provider.get_current_weather(lat, lon, location_id)

    async def get_forecast(self, lat: float, lon: float, location_id: str) -> List[Dict[str, Any]]:
        try:
            return await self.provider.get_forecast(lat, lon, location_id)
        except Exception as e:
            logger.warning(f"Weather forecast error: {e}")
            dev_provider = DevelopmentWeatherProvider()
            return await dev_provider.get_forecast(lat, lon, location_id)

    def get_provider_status(self) -> Dict[str, Any]:
        return {
            "status": "connected" if self.is_live else "development_fallback",
            "is_live": self.is_live,
            "provider_name": "OpenWeatherMap" if self.is_live else "Development Telemetry Seed",
        }


weather_service = WeatherService()
