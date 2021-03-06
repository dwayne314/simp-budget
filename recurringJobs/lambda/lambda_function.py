import psycopg2
from datetime import datetime,timezone
import boto3

ENDPOINT = "simpbudget-staging-db-proxy.proxy-cb9cmzf8ki0f.us-east-2.rds.amazonaws.com"
PORT = "5432"
USR = "develop"
REGION = "us-east-2"
DBNAME = "simpbudget"


def lambda_handler(event, context):

    client = boto3.client('rds')
    token = client.generate_db_auth_token(
        DBHostname=ENDPOINT, Port=PORT, DBUsername=USR, Region=REGION)
    try:

        conn = psycopg2.connect(
            host=ENDPOINT, port=PORT, dbname=DBNAME, user='develop',
            password=token, sslmode='require')

        cur = conn.cursor()
        cur.execute("""with daily_recurring_transactions AS (
    SELECT account_id, amount, note, current_date, now(), 
    CASE 
        WHEN (
            -- Wrong transaction type
            NOT transaction_type = 'weekly' OR
            -- Wrong day of the week
            scheduled_day - (extract(dow from now()) + 1) != 0 OR
            -- Value not sent in before the day started
            NOT created_at::date + 1 <= current_date 
        ) THEN false
        -- Created as a multiple of the frequency
        WHEN ((now()::date - (created_at::date + 1)) / 7) % frequency = 0 THEN true
        ELSE false
    END as weekly_recurring_transactions,
    CASE    
        WHEN (
              -- Wrong transaction type
              NOT transaction_type = 'monthly' OR
              -- special date is not the current date
              special_day = 'last' AND (date_trunc('month', current_date) + interval '1 month' - interval '1 day')::date != current_date OR
              special_day = 'first' AND date_trunc('month', current_date)::date != current_date OR
              -- Scheduled date is not current date
              scheduled_day != extract(DAY from now()) OR
              -- Value not sent in before the day started
              NOT created_at::date + 1 <= current_date
             ) THEN false
        -- Created as a multiple of the frequency
        WHEN extract(month from age( now(), created_at::date + 1))::int % frequency = 0 THEN true
        ELSE false
    END as monthly_recurring_transactions,
    CASE
        WHEN (
              -- Wrong transaction type
              NOT transaction_type = 'daily' OR
              -- Value not sent in before the day started
              NOT created_at::date + 1 <= current_date
        ) THEN false
        ELSE true
    END AS daily_recurring_transactions
    FROM recurring_transactions
)

insert into transactions (account_id, amount, note, date, created_at)   
select account_id, amount, note, current_date, now()
from daily_recurring_transactions
WHERE daily_recurring_transactions OR weekly_recurring_transactions OR monthly_recurring_transactions
""")
        conn.commit()
        print(f"Transactions created at {datetime.now(timezone.utc)} UTC")

    except Exception as e:
        print(f"Database connection failed due to {e} at {datetime.now(timezone.utc)}")  