"""Add LogoutEvent table and session duration tracking

Revision ID: add_logout_events
Revises: 
Create Date: 2025-07-21 04:20:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_logout_events'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add session_duration_seconds column to login_events table
    op.add_column('login_events', sa.Column('session_duration_seconds', sa.Float(), nullable=True))
    
    # Create logout_events table
    op.create_table('logout_events',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('logout_timestamp', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('login_event_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['login_event_id'], ['login_events.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_logout_events_id'), 'logout_events', ['id'], unique=False)


def downgrade() -> None:
    # Drop logout_events table
    op.drop_index(op.f('ix_logout_events_id'), table_name='logout_events')
    op.drop_table('logout_events')
    
    # Remove session_duration_seconds column from login_events table
    op.drop_column('login_events', 'session_duration_seconds') 