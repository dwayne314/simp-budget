"""Add recurring transactions table / add transaction type and special day type enums

Revision ID: 3c6d61faaab9
Revises: bea0628f0a4e
Create Date: 2020-07-08 02:33:27.480078

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3c6d61faaab9'
down_revision = 'bea0628f0a4e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('recurring_transactions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('account_id', sa.Integer(), nullable=True),
    sa.Column('amount', sa.BigInteger(), nullable=False),
    sa.Column('note', sa.String(), nullable=False),
    sa.Column('transaction_type', sa.Enum('daily', 'weekly', 'monthly', name='transaction_types'), nullable=False),
    sa.Column('frequency', sa.Integer(), nullable=False),
    sa.Column('scheduled_day', sa.Integer(), nullable=True),
    sa.Column('special_day', sa.Enum('first', 'last', name='special_day_types'), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.CheckConstraint('NOT(scheduled_day IS NOT NULL AND special_day IS NOT NULL)'),
    sa.CheckConstraint('NOT(scheduled_day IS NULL AND special_day IS NULL)'),
    sa.ForeignKeyConstraint(['account_id'], ['accounts.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('recurring_transactions')
    op.execute('DROP TYPE IF EXISTS special_day_types')
    op.execute('DROP TYPE IF EXISTS transaction_types')
    # ### end Alembic commands ###
