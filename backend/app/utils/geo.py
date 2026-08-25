"""
Slope-Shield AI — Geospatial Utilities
Provides distance calculations, coordinate verification, bounding boxes, geocoding lookups, and corridor hazard indexing.
"""
import math
from typing import Tuple, List, Dict, Any, Optional

EARTH_RADIUS_KM = 6371.0


def haversine_distance(coord1: Tuple[float, float], coord2: Tuple[float, float]) -> float:
    """
    Calculate the great circle distance between two points on the earth in kilometers.
    coords in (lat, lng).
    """
    lat1, lon1 = coord1
    lat2, lon2 = coord2

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) * math.sin(dlat / 2) +
        math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
        math.sin(dlon / 2) * math.sin(dlon / 2)
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(EARTH_RADIUS_KM * c, 2)


def is_in_bounding_box(lat: float, lon: float, bbox: Tuple[float, float, float, float]) -> bool:
    """
    Check if (lat, lon) is inside bounding box (min_lat, min_lon, max_lat, max_lon).
    """
    min_lat, min_lon, max_lat, max_lon = bbox
    return min_lat <= lat <= max_lat and min_lon <= lon <= max_lon


def validate_coordinates(lat: float, lon: float) -> bool:
    """Validate latitude (-90 to 90) and longitude (-180 to 180)."""
    return -90.0 <= lat <= 90.0 and -180.0 <= lon <= 180.0


# Bounding box for North Eastern Region of India (approximate: 21.5°N - 29.5°N, 88.0°E - 97.5°E)
NER_BOUNDING_BOX = (21.5, 88.0, 29.5, 97.5)


def is_ner_region(lat: float, lon: float) -> bool:
    """Returns True if coordinate falls within North Eastern India."""
    return is_in_bounding_box(lat, lon, NER_BOUNDING_BOX)


# Pre-computed geocoding reference gazetteer for North Eastern Region
NER_GAZETTEER = [
    {"name": "Dibang Valley", "district": "Lower Dibang Valley", "state": "Arunachal Pradesh", "lat": 28.6900, "lon": 95.7400, "elevation": 2200, "slope": 42},
    {"name": "Sela Pass", "district": "West Kameng", "state": "Arunachal Pradesh", "lat": 27.5340, "lon": 92.1220, "elevation": 4170, "slope": 38},
    {"name": "Bomdila", "district": "West Kameng", "state": "Arunachal Pradesh", "lat": 27.2640, "lon": 92.4240, "elevation": 2415, "slope": 35},
    {"name": "Tawang", "district": "Tawang", "state": "Arunachal Pradesh", "lat": 27.5860, "lon": 91.8590, "elevation": 3048, "slope": 36},
    {"name": "Noney", "district": "Noney", "state": "Manipur", "lat": 24.7950, "lon": 93.5980, "elevation": 680, "slope": 44},
    {"name": "Tupul", "district": "Noney", "state": "Manipur", "lat": 24.8100, "lon": 93.6120, "elevation": 650, "slope": 40},
    {"name": "Imphal", "district": "Imphal West", "state": "Manipur", "lat": 24.8170, "lon": 93.9368, "elevation": 786, "slope": 12},
    {"name": "Jatinga", "district": "Dima Hasao", "state": "Assam", "lat": 25.1320, "lon": 93.0340, "elevation": 680, "slope": 36},
    {"name": "Haflong", "district": "Dima Hasao", "state": "Assam", "lat": 25.1680, "lon": 93.0180, "elevation": 680, "slope": 32},
    {"name": "Guwahati", "district": "Kamrup Metropolitan", "state": "Assam", "lat": 26.1445, "lon": 91.7362, "elevation": 55, "slope": 14},
    {"name": "Shillong", "district": "East Khasi Hills", "state": "Meghalaya", "lat": 25.5788, "lon": 91.8933, "elevation": 1496, "slope": 26},
    {"name": "Cherrapunji (Sohra)", "district": "East Khasi Hills", "state": "Meghalaya", "lat": 25.2880, "lon": 91.7320, "elevation": 1484, "slope": 45},
    {"name": "Umiam", "district": "Ri-Bhoi", "state": "Meghalaya", "lat": 25.6540, "lon": 91.8920, "elevation": 1010, "slope": 28},
    {"name": "Gangtok", "district": "East Sikkim", "state": "Sikkim", "lat": 27.3380, "lon": 88.6060, "elevation": 1650, "slope": 38},
    {"name": "Mangan", "district": "North Sikkim", "state": "Sikkim", "lat": 27.5100, "lon": 88.5320, "elevation": 1200, "slope": 42},
    {"name": "Kohima", "district": "Kohima", "state": "Nagaland", "lat": 25.6740, "lon": 94.1100, "elevation": 1444, "slope": 30},
    {"name": "Dimapur", "district": "Dimapur", "state": "Nagaland", "lat": 25.8960, "lon": 93.7280, "elevation": 260, "slope": 18},
    {"name": "Aizawl", "district": "Aizawl", "state": "Mizoram", "lat": 23.7270, "lon": 92.7180, "elevation": 1132, "slope": 35},
    {"name": "Lunglei", "district": "Lunglei", "state": "Mizoram", "lat": 22.8860, "lon": 92.7360, "elevation": 850, "slope": 33},
    {"name": "Agartala", "district": "West Tripura", "state": "Tripura", "lat": 23.8315, "lon": 91.2868, "elevation": 15, "slope": 8},
    {"name": "Jampui Hills", "district": "North Tripura", "state": "Tripura", "lat": 23.9500, "lon": 92.2800, "elevation": 930, "slope": 26},
]


def geocode_location(query: str) -> Optional[Dict[str, Any]]:
    """Geocode search query to nearest matching North Eastern location."""
    q = query.strip().lower()
    for item in NER_GAZETTEER:
        if q in item["name"].lower() or q in item["district"].lower() or item["name"].lower() in q:
            return item
    return None
