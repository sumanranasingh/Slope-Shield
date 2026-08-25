"""
Infrastructure & Highway Corridor Monitoring API router.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from datetime import datetime, timezone

from app.database.database import get_db
from app.database.models import Road
from app.schemas.schemas import RoadOut, DataSourceMeta

router = APIRouter()


def compute_road_priority(risk_score: float, status: str) -> str:
    if status in ("Blocked", "Closed") or risk_score >= 80.0:
        return "P1 — Immediate"
    elif risk_score >= 60.0 or status == "Restricted":
        return "P2 — High"
    elif risk_score >= 40.0:
        return "P3 — Monitor"
    return "P4 — Normal"


@router.get("", response_model=List[RoadOut])
async def get_roads(db: AsyncSession = Depends(get_db)):
    roads = (await db.execute(select(Road).order_by(Road.risk_score.desc()))).scalars().all()
    return [
        RoadOut(
            id=r.id,
            highway_code=r.highway_code,
            name=r.name,
            state=r.state or "",
            start_point=r.start_point or "",
            end_point=r.end_point or "",
            length_km=r.length_km or 0.0,
            risk_score=r.risk_score or 0.0,
            risk_level=r.risk_level or "Low",
            priority=compute_road_priority(r.risk_score or 0.0, r.status or "Open"),
            status=r.status or "Open",
            authority=r.authority or "State PWD / BRO",
            last_inspected=r.last_inspected.isoformat() if r.last_inspected else datetime.now(timezone.utc).isoformat(),
            data_source=DataSourceMeta(source="DEMO", provider="Highway Corridor Monitoring"),
        )
        for r in roads
    ]


@router.get("/{id}", response_model=RoadOut)
async def get_road_by_id(id: str, db: AsyncSession = Depends(get_db)):
    r = (await db.execute(select(Road).where(Road.id == id))).scalar_one_or_none()
    if not r:
        raise HTTPException(status_code=404, detail="Road corridor not found")
    return RoadOut(
        id=r.id,
        highway_code=r.highway_code,
        name=r.name,
        state=r.state or "",
        start_point=r.start_point or "",
        end_point=r.end_point or "",
        length_km=r.length_km or 0.0,
        risk_score=r.risk_score or 0.0,
        risk_level=r.risk_level or "Low",
        priority=compute_road_priority(r.risk_score or 0.0, r.status or "Open"),
        status=r.status or "Open",
        authority=r.authority or "",
        last_inspected=r.last_inspected.isoformat() if r.last_inspected else datetime.now(timezone.utc).isoformat(),
    )


@router.patch("/{id}/status")
async def update_road_status(id: str, status_val: str, db: AsyncSession = Depends(get_db)):
    r = (await db.execute(select(Road).where(Road.id == id))).scalar_one_or_none()
    if not r:
        raise HTTPException(status_code=404, detail="Road corridor not found")
    r.status = status_val
    r.last_inspected = datetime.now(timezone.utc)
    await db.commit()
    return {"id": r.id, "status": r.status, "updated_at": r.last_inspected.isoformat()}
