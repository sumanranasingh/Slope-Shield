"""
Slope-Shield AI — GIS & Infrastructure Proximity Service
Analyzes vulnerability buffers, nearby transportation corridors, and critical community assets.
"""
from typing import Dict, Any, List, Tuple
from app.utils.geo import haversine_distance


class GISService:
    @staticmethod
    def get_nearby_infrastructure(lat: float, lon: float, radius_km: float = 25.0) -> List[Dict[str, Any]]:
        """Identify critical highways, rail lines, and bridges within the proximity buffer."""
        # Key infrastructure corridors in NER
        corridors = [
            {"name": "NH-13 Trans-Arunachal Highway", "code": "NH-13", "type": "National Highway", "authority": "BRO", "coords": (27.534, 92.122)},
            {"name": "NH-37 Imphal-Silchar Highway", "code": "NH-37", "type": "National Highway", "authority": "NHIDCL", "coords": (24.795, 93.598)},
            {"name": "Jiribam-Tupul-Imphal Railway Line", "code": "JTI-RAIL", "type": "Strategic Railway", "authority": "NFR", "coords": (24.810, 93.612)},
            {"name": "NH-10 Sevoke-Gangtok Highway", "code": "NH-10", "type": "National Highway", "authority": "BRO", "coords": (27.338, 88.606)},
            {"name": "NH-40 Shillong-Dawki Road", "code": "NH-40", "type": "National Highway", "authority": "State PWD", "coords": (25.654, 91.892)},
            {"name": "Lumding-Badarpur Hill Section", "code": "LBR-RAIL", "type": "Railway Mountain Corridor", "authority": "NFR", "coords": (25.132, 93.034)},
        ]

        nearby = []
        for c in corridors:
            dist = haversine_distance((lat, lon), c["coords"])
            if dist <= radius_km:
                nearby.append({
                    "name": c["name"],
                    "code": c["code"],
                    "type": c["type"],
                    "authority": c["authority"],
                    "distance_km": dist,
                    "exposure_level": "Direct Alignment" if dist < 1.0 else "Critical Corridor Buffer" if dist < 5.0 else "Regional Access Route",
                })
        return sorted(nearby, key=lambda x: x["distance_km"])

    @staticmethod
    def get_vulnerable_settlements(lat: float, lon: float) -> List[Dict[str, Any]]:
        """List nearby habitations and villages susceptible to debris runs."""
        return [
            {"village": "Upper Slope Habitation", "population_est": 450, "distance_km": 0.8, "evacuation_route": "Ridge Trail East"},
            {"village": "Valley Highway Junction", "population_est": 1200, "distance_km": 2.4, "evacuation_route": "NH Main Bypass"},
        ]


gis_service = GISService()
