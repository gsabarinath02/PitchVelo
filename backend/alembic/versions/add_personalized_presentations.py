"""add personalized presentations

Revision ID: add_personalized_presentations
Revises: add_session_duration
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_personalized_presentations'
down_revision = 'add_session_duration'
branch_labels = None
depends_on = None


def upgrade():
    # Create personalized_presentations table
    op.create_table('personalized_presentations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('subtitle', sa.String(), nullable=True),
        sa.Column('slides', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_personalized_presentations_id'), 'personalized_presentations', ['id'], unique=False)


def downgrade():
    # Drop personalized_presentations table
    op.drop_index(op.f('ix_personalized_presentations_id'), table_name='personalized_presentations')
    op.drop_table('personalized_presentations') 