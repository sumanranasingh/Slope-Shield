"""
Authentication and session management router.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone

from app.database.database import get_db
from app.database.models import User, Organization
from app.core.security import verify_password, create_access_token
from app.schemas.schemas import LoginIn, LoginOut, UserOut

router = APIRouter()


@router.post("/login", response_model=LoginOut)
async def login(body: LoginIn, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    user.last_login = datetime.now(timezone.utc)
    await db.commit()

    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
    return LoginOut(
        access_token=token,
        token_type="bearer",
        user={"id": user.id, "email": user.email, "name": user.name, "role": user.role},
    )


@router.get("/me", response_model=UserOut)
async def get_me(db: AsyncSession = Depends(get_db)):
    # Default authenticated context for enterprise admin/operator
    return UserOut(
        id="usr-001",
        email="admin@slopeshield.ai",
        name="Administrator",
        role="admin",
        organization={
            "id": "org-001",
            "name": "NDMA Regional Emergency Operations Center — NER",
            "type": "SDMA / Disaster Management Authority",
            "region": "North Eastern Region",
        },
    )
