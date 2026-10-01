"""add email verification

Revision ID: 2ce76ab8a323
Revises:
Create Date: 2026-10-01 14:43:57.863189

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "2ce76ab8a323"
down_revision: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column(
            "email_verified",
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),
    )


def downgrade() -> None:
    op.drop_column("users", "email_verified")
