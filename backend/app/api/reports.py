"""
Citizen & Field Ground-Truth Reports API router.
"""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from datetime import datetime, timezone

from app.database.database import get_db
from app.database.models import CitizenReport
from app.schemas.schemas import CreateReportIn, UpdateReportIn, ReportOut, DataSourceMeta
from app.services.report_service import report_service

router = APIRouter()


@router.post("", response_model=ReportOut, status_code=status.HTTP_201_CREATED)
async def create_report(body: CreateReportIn, db: AsyncSession = Depends(get_db)):
    rpt = CitizenReport(
        category=body.category,
        severity=body.severity,
        description=body.description,
        latitude=body.latitude,
        longitude=body.longitude,
        location_name=body.location_name or f"Lat: {body.latitude:.3f}, Lon: {body.longitude:.3f}",
        reporter_name=body.reporter_name,
        reporter_phone=body.reporter_phone,
        status="NEW",
        created_at=datetime.now(timezone.utc),
    )
    db.add(rpt)
    await db.commit()
    await db.refresh(rpt)

    return ReportOut(
        id=rpt.id,
        category=rpt.category,
        severity=rpt.severity or "Moderate",
        description=rpt.description or "",
        latitude=rpt.latitude,
        longitude=rpt.longitude,
        location_name=rpt.location_name,
        state=rpt.state,
        status=rpt.status,
        reporter_name=rpt.reporter_name,
        timestamp=rpt.created_at.isoformat(),
        data_source=DataSourceMeta(source="DEMO", provider="Field Ground-Truth Ingestion"),
    )


@router.get("", response_model=List[ReportOut])
async def get_reports(
    status_filter: Optional[str] = Query(None, alias="status"),
    category: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    q = select(CitizenReport)
    if status_filter and status_filter.lower() != "all":
        q = q.where(CitizenReport.status == status_filter)
    if category and category.lower() != "all":
        q = q.where(CitizenReport.category == category)

    reports = (await db.execute(q.order_by(CitizenReport.created_at.desc()))).scalars().all()
    return [
        ReportOut(
            id=r.id,
            category=r.category,
            severity=r.severity or "Moderate",
            description=r.description or "",
            latitude=r.latitude or 0.0,
            longitude=r.longitude or 0.0,
            location_name=r.location_name,
            state=r.state,
            status=r.status,
            reporter_name=r.reporter_name or "Anonymous",
            timestamp=r.created_at.isoformat() if r.created_at else datetime.now(timezone.utc).isoformat(),
            data_source=DataSourceMeta(source="DEMO", provider="Field Ground-Truth Ingestion"),
        )
        for r in reports
    ]


@router.get("/{id}", response_model=ReportOut)
async def get_report_by_id(id: str, db: AsyncSession = Depends(get_db)):
    r = (await db.execute(select(CitizenReport).where(CitizenReport.id == id))).scalar_one_or_none()
    if not r:
        raise HTTPException(status_code=404, detail="Report not found")
    return ReportOut(
        id=r.id,
        category=r.category,
        severity=r.severity or "Moderate",
        description=r.description or "",
        latitude=r.latitude or 0.0,
        longitude=r.longitude or 0.0,
        location_name=r.location_name,
        state=r.state,
        status=r.status,
        reporter_name=r.reporter_name or "Anonymous",
        timestamp=r.created_at.isoformat() if r.created_at else datetime.now(timezone.utc).isoformat(),
    )


@router.patch("/{id}", response_model=ReportOut)
async def update_report_status(id: str, body: UpdateReportIn, db: AsyncSession = Depends(get_db)):
    r = (await db.execute(select(CitizenReport).where(CitizenReport.id == id))).scalar_one_or_none()
    if not r:
        raise HTTPException(status_code=404, detail="Report not found")

    if body.status:
        if not report_service.validate_transition(r.status, body.status):
            raise HTTPException(status_code=400, detail=f"Invalid transition from {r.status} to {body.status}")
        r.status = body.status
        if body.status == "VERIFIED":
            r.verified_by = body.verified_by or "Command Geotechnical Officer"
            r.verified_at = datetime.now(timezone.utc)
        elif body.status == "RESOLVED":
            r.resolved_at = datetime.now(timezone.utc)

    if body.action_taken:
        r.action_taken = body.action_taken

    await db.commit()
    await db.refresh(r)
    return await get_report_by_id(id, db)
