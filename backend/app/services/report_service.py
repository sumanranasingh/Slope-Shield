"""
Slope-Shield AI — Citizen & Field Report Lifecycle Service
Handles report ingestion, verification workflow, and ground-truth validation.
"""
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

REPORT_STATUSES = ["NEW", "UNDER_REVIEW", "VERIFIED", "ACTIONED", "RESOLVED"]


class ReportService:
    @staticmethod
    def validate_transition(current_status: str, next_status: str) -> bool:
        """Check if report status transition is valid."""
        if current_status not in REPORT_STATUSES or next_status not in REPORT_STATUSES:
            return False
        curr_idx = REPORT_STATUSES.index(current_status)
        next_idx = REPORT_STATUSES.index(next_status)
        return next_idx >= curr_idx  # allow forward transitions

    @staticmethod
    def classify_hazard_priority(category: str, severity: str) -> str:
        """Determines operational triage level based on report category and severity."""
        if severity == "Critical" or category in ("landslide", "road_blockage"):
            return "P1-IMMEDIATE"
        elif severity == "High" or category in ("crack_observed", "subsidence"):
            return "P2-ELEVATED"
        return "P3-ROUTINE"


report_service = ReportService()
