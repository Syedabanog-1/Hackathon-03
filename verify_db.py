import psycopg2
import sys

DATABASE_URL = "postgres://default:K9maxZIJRFC4@ep-frosty-pond-a46ysxde-pooler.us-east-1.aws.neon.tech/verceldb?sslmode=require"

try:
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name")
    tables = [r[0] for r in cur.fetchall()]
    conn.close()
    print("OK Tables:", tables)
    print("OK Count:", len(tables))
except Exception as e:
    print("FAIL:", e)
    sys.exit(1)
