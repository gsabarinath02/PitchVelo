"""Add session_duration_seconds to login_events

Revision ID: add_session_duration
Revises: add_logout_events
Create Date: 2025-07-21 04:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_session_duration'
down_revision = 'add_logout_events'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add session_duration_seconds column to login_events table
    op.add_column('login_events', sa.Column('session_duration_seconds', sa.Float(), nullable=True))


def downgrade() -> None:
    # Remove session_duration_seconds column from login_events table
    op.drop_column('login_events', 'session_duration_seconds') 