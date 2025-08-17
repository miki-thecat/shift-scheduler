import os, io
from datetime import datetime, date, time, timedelta
from dateutil.relativedelta import relativedelta
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pymysql

DB_HOST = os.getenv("DB_HOST", "db")
DB_USER = os.getenv("DB_USER", "user")
DB_PASS = os.getenv("DB_PASS", "pass")
DB_NAME = os.getenv("DB_NAME", "app")

def db():
    return pymysql.connect(
        host=DB_HOST, user=DB_USER, password=DB_PASS, database=DB_NAME,
        charset="utf8mb4", autocommit=True,
        cursorclass=pymysql.cursors.DictCursor
    )


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})


# --utils--
def month_range(yyyy_mm: str):
    first = datetime.strptime(yyyy_mm + "-01", "%Y-%m-%d").date()
    last = (first + relativedelta(months=1)) - timedelta(days=1)
    return first, last

def ensure_tables():
    pass

#---health---
@app.get("/health")
def health():
    return {"ok": True}

# ---periods---
@app.post("/api/periods")
def create_period():
     """body: { "month": "2025-08", "name": "2025年8月", "deadline": "2025-08-25" }"""
     body = request.get_json(force=True)
     month = body["month"]
     name = body.get["name"] or month
     deadline = body.get("deadline")
     with db() as conn, conn.cursor() as cur:
         cur.execute("""INSERT INTO periods(name, month, deadline)
                        values(%s, %s, %s) on DUPLICATE ley update name=values(name), deadline=values)"""
                     (name, month, deadline))
         cur.execute("select * from periods where month = %s", (month,))
         row = cur.fetchone()
         return jsonify({"ok": True, "periods": row}), 201

@app.get("/api/periods")
def list_periods():
    with db() as conn, conn.cursor() as cur:
        cur.execute("select * from periods order by month desc")
        rows = cur.fetchone()
    return jsonify({"ok": True, "items": rows})


@app.post("/api/availabilities")
def upsert_availabilities():
    data = request.get_json()
    line_user_id = data.get("line_user_id", "dev-user")
    items = data["items"]
    cur = DB.cursor()
    cur.execute("SELECT id FROM users WHERE line_user_id=%s", (line_user_id,))
    row = cur.fetchone()
    if not row:
        cur.execute("INSERT INTO users(name,line_user_id) VALUES(%s,%s)", ("Dev User", line_user_id))
        cur.execute("SELECT id FROM users WHERE line_user_id=%s", (line_user_id,))
        row = cur.fetchone()
    uid = row[0]
    for it in items:
        cur.execute("""INSERT INTO availabilities(user_id,date,start_dt,end_dt,status)
                       VALUES(%s,%s,%s,%s,%s)""",
                    (uid, it["date"],
                     datetime.fromisoformat(it["start"]),
                     datetime.fromisoformat(it["end"]),
                     it["status"]))
    return {"ok": True}, 201

