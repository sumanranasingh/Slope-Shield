"""
Early Warning Operations Hub API router.
"""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from datetime import datetime, timezone

from app.database.database import get_db
from app.database.models import Warning, Location
from app.schemas.schemas import WarningOut, CreateWarningIn, UpdateWarningIn, EscalateWarningIn, AcknowledgeOut, DataSourceMeta
from app.services.notification_service import notification_service

router = APIRouter()


@router.get("", response_model=List[WarningOut])
async def get_warnings(
    status_filter: Optional[str] = Query(None, alias="status"),
    severity: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    q = select(Warning)
    if status_filter and status_filter.lower() != "all":
        q = q.where(Warning.status == status_filter)
    if severity and severity.lower() != "all":
        q = q.where(Warning.severity == severity)
    if state and state.lower() != "all":
        q = q.where(Warning.state == state)

    result = await db.execute(q.order_by(Warning.created_at.desc()))
    warns = result.scalars().all()

    return [
        WarningOut(
            id=w.id,
            location_id=w.location_id or "",
            location=w.location_name or "",
            state=w.state or "",
            severity=w.severity,
            risk_score=w.risk_score or 75.0,
            risk_probability=w.risk_probability or 0.75,
            trigger=w.trigger or "Monsoon precipitation threshold exceeded",
            message=w.message or "",
            recommended_action=w.recommended_action or "",
            timestamp=w.created_at.isoformat() if w.created_at else datetime.now(timezone.utc).isoformat(),
            status=w.status,
            affected_area=w.affected_area or "5km radius buffer",
            affected_population=w.affected_population or 1200,
            issued_by=w.issued_by or "SlopeShield Warning Engine",
            acknowledged_by=w.acknowledged_by,
            acknowledged_at=w.acknowledged_at.isoformat() if w.acknowledged_at else None,
            escalated_by=w.resolved_by if w.status == "Escalated" else None,
            escalated_at=w.resolved_at.isoformat() if w.status == "Escalated" and w.resolved_at else None,
            resolved_by=w.resolved_by if w.status == "Resolved" else None,
            resolved_at=w.resolved_at.isoformat() if w.status == "Resolved" and w.resolved_at else None,
            response_team=w.response_team,
            data_source=DataSourceMeta(source="DEMO", provider="SlopeShield CAP Alert Center"),
        )
        for w in warns
    ]


@router.get("/{id}", response_model=WarningOut)
async def get_warning_by_id(id: str, db: AsyncSession = Depends(get_db)):
    w = (await db.execute(select(Warning).where(Warning.id == id))).scalar_one_or_none()
    if not w:
        raise HTTPException(status_code=404, detail="Warning not found")
    return WarningOut(
        id=w.id,
        location_id=w.location_id or "",
        location=w.location_name or "",
        state=w.state or "",
        severity=w.severity,
        risk_score=w.risk_score or 75.0,
        risk_probability=w.risk_probability or 0.75,
        trigger=w.trigger or "",
        message=w.message or "",
        recommended_action=w.recommended_action or "",
        timestamp=w.created_at.isoformat() if w.created_at else datetime.now(timezone.utc).isoformat(),
        status=w.status,
        affected_area=w.affected_area or "",
        affected_population=w.affected_population or 0,
        issued_by=w.issued_by or "System",
        acknowledged_by=w.acknowledged_by,
        acknowledged_at=w.acknowledged_at.isoformat() if w.acknowledged_at else None,
        resolved_by=w.resolved_by,
        resolved_at=w.resolved_at.isoformat() if w.resolved_at else None,
        response_team=w.response_team,
    )


@router.post("", response_model=WarningOut, status_code=status.HTTP_201_CREATED)
async def create_warning(body: CreateWarningIn, db: AsyncSession = Depends(get_db)):
    loc = (await db.execute(select(Location).where(Location.id == body.location_id))).scalar_one_or_none()
    loc_name = loc.name if loc else body.location_id
    state = loc.state if loc else "North Eastern Region"

    w = Warning(
        location_id=body.location_id,
        location_name=loc_name,
        state=state,
        severity=body.severity,
        risk_score=92.0 if body.severity == "Critical" else 75.0 if body.severity == "High" else 50.0,
        risk_probability=0.92 if body.severity == "Critical" else 0.75 if body.severity == "High" else 0.50,
        trigger="Authority Broadcast Dispatch",
        message=body.message,
        recommended_action=body.recommended_action,
        affected_area=body.affected_area or f"{loc_name} corridor",
        affected_population=3000,
        status="Active",
        issued_by="Disaster Operations Command",
        response_team=body.response_team or "SDRF First Responders",
        created_at=datetime.now(timezone.utc),
    )
    db.add(w)
    await db.commit()
    await db.refresh(w)

    # Trigger multi-channel alert dispatch
    await notification_service.dispatch_alert(
        warning_id=w.id,
        channels=["sms", "email", "push"],
        recipients=["district.eoc@gov.in", "sdrf.ner@gov.in"],
        message=body.message,
        severity=body.severity,
    )

    return WarningOut(
        id=w.id,
        location_id=w.location_id or "",
        location=w.location_name or "",
        state=w.state or "",
        severity=w.severity,
        risk_score=w.risk_score or 75.0,
        risk_probability=w.risk_probability or 0.75,
        trigger=w.trigger or "",
        message=w.message or "",
        recommended_action=w.recommended_action or "",
        timestamp=w.created_at.isoformat(),
        status=w.status,
        affected_area=w.affected_area or "",
        affected_population=w.affected_population or 0,
        issued_by=w.issued_by or "",
        response_team=w.response_team,
    )


@router.patch("/{id}", response_model=WarningOut)
async def update_warning(id: str, body: UpdateWarningIn, db: AsyncSession = Depends(get_db)):
    w = (await db.execute(select(Warning).where(Warning.id == id))).scalar_one_or_none()
    if not w:
        raise HTTPException(status_code=404, detail="Warning not found")
    if body.severity is not None: w.severity = body.severity
    if body.status is not None: w.status = body.status
    if body.recommended_action is not None: w.recommended_action = body.recommended_action
    if body.response_team is not None: w.response_team = body.response_team
    await db.commit()
    await db.refresh(w)
    return await get_warning_by_id(id, db)


@router.post("/{id}/acknowledge", response_model=AcknowledgeOut)
async def acknowledge_warning(id: str, db: AsyncSession = Depends(get_db)):
    w = (await db.execute(select(Warning).where(Warning.id == id))).scalar_one_or_none()
    if not w:
        raise HTTPException(status_code=404, detail="Warning not found")

    w.status = "Acknowledged"
    w.acknowledged_by = "District Magistrate / Operations Desk"
    w.acknowledged_at = datetime.now(timezone.utc)
    await db.commit()

    return AcknowledgeOut(
        id=w.id,
        status="Acknowledged",
        acknowledged_by=w.acknowledged_by,
        acknowledged_at=w.acknowledged_at.isoformat(),
    )


@router.post("/{id}/escalate", response_model=WarningOut)
async def escalate_warning(id: str, body: EscalateWarningIn, db: AsyncSession = Depends(get_db)):
    w = (await db.execute(select(Warning).where(Warning.id == id))).scalar_one_or_none()
    if not w:
        raise HTTPException(status_code=404, detail="Warning not found")

    w.status = "Escalated"
    w.severity = body.target_severity
    w.risk_score = 95.0 if body.target_severity == "Critical" else 80.0
    w.risk_probability = 0.95 if body.target_severity == "Critical" else 0.80
    w.response_team = body.dispatched_team or "SDRF Tactical Rescue Team + BRO Mobile Unit"
    w.recommended_action = f"ESCALATED DIRECTIVE: {body.escalation_reason}. Mandatory emergency road restrictions & evacuation advisory."
    w.resolved_by = "State Disaster Operations Desk (Escalated)"
    w.resolved_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(w)

    await notification_service.dispatch_alert(
        warning_id=w.id,
        channels=["sms", "email", "push"],
        recipients=["state.disaster.mgmt@gov.in", "sdrf.ner@gov.in"],
        message=f"ESCALATION ALERT: {w.location_name} escalated to {w.severity}. Reason: {body.escalation_reason}",
        severity=w.severity,
    )

    return await get_warning_by_id(id, db)


@router.post("/{id}/resolve")
async def resolve_warning(id: str, db: AsyncSession = Depends(get_db)):
    w = (await db.execute(select(Warning).where(Warning.id == id))).scalar_one_or_none()
    if not w:
        raise HTTPException(status_code=404, detail="Warning not found")

    w.status = "Resolved"
    w.resolved_by = "Command Duty Officer"
    w.resolved_at = datetime.now(timezone.utc)
    await db.commit()

    return {"id": w.id, "status": "Resolved", "resolved_at": w.resolved_at.isoformat()}
