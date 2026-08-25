"""
Pytest configuration using FastAPI TestClient with lifespan context.
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database.database import init_db, async_session
from seed.seed_data import seed_database
import asyncio


@pytest.fixture(scope="session", autouse=True)
def init_test_db():
    async def _init():
        await init_db()
        async with async_session() as session:
            await seed_database(session)
    asyncio.run(_init())


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client
