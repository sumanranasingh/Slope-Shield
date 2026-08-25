"""Initial schema migration for SlopeShield AI

Revision ID: 001_initial
Revises: 
Create Date: 2026-08-25 10:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = '001_initial'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Organizations
    op.create_table(
        'organizations',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('type', sa.String(length=100), nullable=True),
        sa.Column('region', sa.String(length=100), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )

    # 2. Users
    op.create_table(
        'users',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('email', sa.String(length=255), nullable=False, unique=True, index=True),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('role', sa.String(length=50), nullable=True, default='analyst'),
        sa.Column('organization_id', sa.String(), sa.ForeignKey('organizations.id'), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True, default=True),
        sa.Column('last_login', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )

    # 3. Locations
    op.create_table(
        'locations',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('district', sa.String(length=100), nullable=False),
        sa.Column('state', sa.String(length=100), nullable=False, index=True),
        sa.Column('latitude', sa.Float(), nullable=False),
        sa.Column('longitude', sa.Float(), nullable=False),
        sa.Column('elevation', sa.Float(), nullable=True),
        sa.Column('slope', sa.Float(), nullable=True),
        sa.Column('land_cover', sa.String(length=100), nullable=True),
        sa.Column('geological_class', sa.String(length=200), nullable=True),
        sa.Column('geological_factor', sa.Float(), nullable=True, default=0.5),
        sa.Column('data_coverage', sa.Float(), nullable=True, default=80.0),
        sa.Column('status', sa.String(length=50), nullable=True, default='Active'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
    )

    # 4. Risk Predictions
    op.create_table(
        'risk_predictions',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('location_id', sa.String(), sa.ForeignKey('locations.id'), nullable=False, index=True),
        sa.Column('risk_score', sa.Float(), nullable=False),
        sa.Column('risk_level', sa.String(length=20), nullable=False),
        sa.Column('risk_probability', sa.Float(), nullable=True),
        sa.Column('rainfall_24h', sa.Float(), nullable=True),
        sa.Column('rainfall_72h', sa.Float(), nullable=True),
        sa.Column('rainfall_7d', sa.Float(), nullable=True),
        sa.Column('soil_moisture', sa.Float(), nullable=True),
        sa.Column('temperature', sa.Float(), nullable=True),
        sa.Column('humidity', sa.Float(), nullable=True),
        sa.Column('ground_movement', sa.Float(), nullable=True),
        sa.Column('recommended_action', sa.Text(), nullable=True),
        sa.Column('explanation', sa.Text(), nullable=True),
        sa.Column('model_version', sa.String(length=50), nullable=True),
        sa.Column('predicted_at', sa.DateTime(), nullable=True, index=True),
    )

    # 5. Weather Observations
    op.create_table(
        'weather_observations',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('location_id', sa.String(), sa.ForeignKey('locations.id'), nullable=False, index=True),
        sa.Column('temperature', sa.Float(), nullable=True),
        sa.Column('humidity', sa.Float(), nullable=True),
        sa.Column('rainfall_1h', sa.Float(), nullable=True),
        sa.Column('rainfall_24h', sa.Float(), nullable=True),
        sa.Column('rainfall_72h', sa.Float(), nullable=True),
        sa.Column('rainfall_7d', sa.Float(), nullable=True),
        sa.Column('wind_speed', sa.Float(), nullable=True),
        sa.Column('wind_direction', sa.String(length=20), nullable=True),
        sa.Column('pressure', sa.Float(), nullable=True),
        sa.Column('visibility', sa.Float(), nullable=True),
        sa.Column('cloud_cover', sa.Float(), nullable=True),
        sa.Column('condition', sa.String(length=100), nullable=True),
        sa.Column('observed_at', sa.DateTime(), nullable=True, index=True),
    )

    # 6. Soil Observations
    op.create_table(
        'soil_observations',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('location_id', sa.String(), sa.ForeignKey('locations.id'), nullable=False, index=True),
        sa.Column('soil_moisture', sa.Float(), nullable=True),
        sa.Column('pore_pressure', sa.Float(), nullable=True),
        sa.Column('soil_temperature', sa.Float(), nullable=True),
        sa.Column('saturation_level', sa.String(length=20), nullable=True),
        sa.Column('observed_at', sa.DateTime(), nullable=True),
    )

    # 7. Historical Landslides
    op.create_table(
        'historical_landslides',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('location_id', sa.String(), sa.ForeignKey('locations.id'), nullable=True, index=True),
        sa.Column('date', sa.String(length=50), nullable=True),
        sa.Column('type', sa.String(length=100), nullable=True),
        sa.Column('severity', sa.String(length=50), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('latitude', sa.Float(), nullable=True),
        sa.Column('longitude', sa.Float(), nullable=True),
    )

    # 8. Roads
    op.create_table(
        'roads',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('highway_code', sa.String(length=20), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('state', sa.String(length=100), nullable=True, index=True),
        sa.Column('start_point', sa.String(length=200), nullable=True),
        sa.Column('end_point', sa.String(length=200), nullable=True),
        sa.Column('length_km', sa.Float(), nullable=True),
        sa.Column('risk_score', sa.Float(), nullable=True),
        sa.Column('risk_level', sa.String(length=20), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=True, default='Open'),
        sa.Column('authority', sa.String(length=50), nullable=True),
        sa.Column('last_inspected', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )

    # 9. Warnings
    op.create_table(
        'warnings',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('location_id', sa.String(), sa.ForeignKey('locations.id'), nullable=True, index=True),
        sa.Column('location_name', sa.String(length=200), nullable=True),
        sa.Column('state', sa.String(length=100), nullable=True),
        sa.Column('severity', sa.String(length=20), nullable=False),
        sa.Column('risk_score', sa.Float(), nullable=True),
        sa.Column('risk_probability', sa.Float(), nullable=True),
        sa.Column('trigger', sa.String(length=200), nullable=True),
        sa.Column('message', sa.Text(), nullable=True),
        sa.Column('recommended_action', sa.Text(), nullable=True),
        sa.Column('affected_area', sa.String(length=200), nullable=True),
        sa.Column('affected_population', sa.Integer(), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=True, default='Active'),
        sa.Column('issued_by', sa.String(length=100), nullable=True),
        sa.Column('acknowledged_by', sa.String(length=100), nullable=True),
        sa.Column('acknowledged_at', sa.DateTime(), nullable=True),
        sa.Column('resolved_by', sa.String(length=100), nullable=True),
        sa.Column('resolved_at', sa.DateTime(), nullable=True),
        sa.Column('response_team', sa.String(length=200), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True, index=True),
        sa.Column('expires_at', sa.DateTime(), nullable=True),
    )

    # 10. Citizen Reports
    op.create_table(
        'citizen_reports',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('category', sa.String(length=50), nullable=False),
        sa.Column('severity', sa.String(length=20), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('latitude', sa.Float(), nullable=True),
        sa.Column('longitude', sa.Float(), nullable=True),
        sa.Column('location_name', sa.String(length=200), nullable=True),
        sa.Column('state', sa.String(length=100), nullable=True),
        sa.Column('district', sa.String(length=100), nullable=True),
        sa.Column('reporter_name', sa.String(length=200), nullable=True),
        sa.Column('reporter_phone', sa.String(length=20), nullable=True),
        sa.Column('reporter_role', sa.String(length=50), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=True, default='NEW'),
        sa.Column('verified_by', sa.String(length=100), nullable=True),
        sa.Column('verified_at', sa.DateTime(), nullable=True),
        sa.Column('action_taken', sa.Text(), nullable=True),
        sa.Column('resolved_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True, index=True),
    )

    # 11. Satellite Observations
    op.create_table(
        'satellite_observations',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('location_id', sa.String(), sa.ForeignKey('locations.id'), nullable=True, index=True),
        sa.Column('source', sa.String(length=50), nullable=True),
        sa.Column('observation_type', sa.String(length=100), nullable=True),
        sa.Column('resolution', sa.String(length=20), nullable=True),
        sa.Column('displacement_cm', sa.Float(), nullable=True),
        sa.Column('confidence', sa.Float(), nullable=True),
        sa.Column('area_hectares', sa.Float(), nullable=True),
        sa.Column('observed_at', sa.DateTime(), nullable=True),
    )

    # 12. Notifications
    op.create_table(
        'notifications',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('warning_id', sa.String(), sa.ForeignKey('warnings.id'), nullable=True),
        sa.Column('channel', sa.String(length=20), nullable=True),
        sa.Column('recipient', sa.String(length=200), nullable=True),
        sa.Column('message', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=True, default='PENDING'),
        sa.Column('sent_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )

    # 13. Response Actions
    op.create_table(
        'response_actions',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('warning_id', sa.String(), sa.ForeignKey('warnings.id'), nullable=True),
        sa.Column('location_id', sa.String(), sa.ForeignKey('locations.id'), nullable=True),
        sa.Column('action_type', sa.String(length=100), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('assigned_team', sa.String(length=200), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=True, default='pending'),
        sa.Column('started_at', sa.DateTime(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )


def downgrade() -> None:
    op.drop_table('response_actions')
    op.drop_table('notifications')
    op.drop_table('satellite_observations')
    op.drop_table('citizen_reports')
    op.drop_table('warnings')
    op.drop_table('roads')
    op.drop_table('historical_landslides')
    op.drop_table('soil_observations')
    op.drop_table('weather_observations')
    op.drop_table('risk_predictions')
    op.drop_table('locations')
    op.drop_table('users')
    op.drop_table('organizations')
