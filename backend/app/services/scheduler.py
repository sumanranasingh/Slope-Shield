"""
Slope-Shield AI — Background Telemetry & Warning Scheduler
Runs non-blocking asynchronous periodic evaluation loops for risk recalculation,
warning deduplication, and notification ledger maintenance.
"""
import asyncio
import logging
from datetime import datetime, timezone
from sqlalchemy import select, update
from app.database.database import async_session
from app.database.models import Location, RiskPrediction, Warning, WeatherObservation
from app.services.warning_service import warning_service
from app.services.ml_service import ml_service

logger = logging.getLogger(__name__)


class BackgroundTelemetryScheduler:
    def __init__(self):
        self._running = False
        self._task: asyncio.Task = None

    async def start(self):
        if self._running:
            return
        self._running = True
        self._task = asyncio.create_task(self._run_loop())
        logger.info("Background Telemetry Scheduler started successfully.")

    async def stop(self):
        self._running = False
        if self._task and not self._task.done():
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
        logger.info("Background Telemetry Scheduler stopped.")

    async def _run_loop(self):
        while self._running:
            try:
                await self._evaluate_telemetry_and_warnings()
                await self._expire_stale_warnings()
            except Exception as e:
                logger.error(f"Error in background telemetry scheduler: {e}")
            await asyncio.sleep(60)  # Evaluation interval (60 seconds)

    async def _evaluate_telemetry_and_warnings(self):
        """Evaluate latest measurements across all locations and trigger warnings if justified."""
        async with async_session() as db:
            locs = (await db.execute(select(Location))).scalars().all()
            for loc in locs:
                pred = (await db.execute(
                    select(RiskPrediction)
                    .where(RiskPrediction.location_id == loc.id)
                    .order_by(RiskPrediction.predicted_at.desc())
                    .limit(1)
                )).scalar_one_or_none()

                if not pred:
                    continue

                # Check if there is already an active warning for this location
                active_warn = (await db.execute(
                    select(Warning)
                    .where(Warning.location_id == loc.id, Warning.status.in_(["Active", "Acknowledged", "Escalated"]))
                    .order_by(Warning.created_at.desc())
                    .limit(1)
                )).scalar_one_or_none()

                existing_dict = {
                    "severity": active_warn.severity,
                    "status": active_warn.status,
                } if active_warn else None

                eval_result = warning_service.evaluate_risk_for_warning(
                    location_name=loc.name,
                    state=loc.state,
                    risk_score=pred.risk_score,
                    rainfall_24h=pred.rainfall_24h or 45.0,
                    slope_degree=loc.slope or 30.0,
                    soil_moisture=pred.soil_moisture or 60.0,
                    location_id=loc.id,
                    existing_active_warning=existing_dict,
                )

                if eval_result and not active_warn:
                    new_w = Warning(
                        location_id=loc.id,
                        location_name=loc.name,
                        state=loc.state,
                        severity=eval_result["severity"],
                        risk_score=eval_result["risk_score"],
                        risk_probability=eval_result["risk_probability"],
                        trigger=eval_result["trigger"],
                        message=eval_result["message"],
                        recommended_action=eval_result["recommended_action"],
                        affected_area=eval_result["affected_area"],
                        affected_population=eval_result["affected_population"],
                        status="Active",
                        issued_by="SlopeShield Automated Warning Engine",
                        response_team="Regional SDRF Unit",
                        created_at=datetime.now(timezone.utc),
                    )
                    db.add(new_w)
                    await db.commit()
                    logger.info(f"Auto-generated early warning for {loc.name} ({eval_result['severity']})")

    async def _expire_stale_warnings(self):
        """Mark warnings whose expires_at is past as Expired."""
        now = datetime.now(timezone.utc)
        async with async_session() as db:
            result = await db.execute(
                select(Warning).where(Warning.status == "Active", Warning.expires_at < now)
            )
            expired_warns = result.scalars().all()
            for w in expired_warns:
                w.status = "Expired"
            if expired_warns:
                await db.commit()
                logger.info(f"Expired {len(expired_warns)} outdated warnings.")


telemetry_scheduler = BackgroundTelemetryScheduler()
