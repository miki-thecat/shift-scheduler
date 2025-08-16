import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS


try:
    import MySQLdb as mysql
except ModuleNotFoundError:
    import pymysql as mysql

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "*"}})

def get_db():
    return mysql.connect(
        host=os.getenv("DB_HOST", "db"),
        user=os.getenv("DB_USER", "user"),
        passwd=os.getenv("DB_PASS", "pass"),
        db=os.getenv("DB_NAME", "app"),
        charset="utf8mb4",
        autocommit=True,
    )

@app.get("/health")
def health():
    return {"ok": True}

# 最近の送信を取得する一覧API
@app.get("/api/availabilities")
def list_availabilities():
    limit = int(request.args.get("limit", 20))
    con = get_db(); cur = con.cursor()
    cur.execute("""
        SELECT a.id, u.name, a.date, a.start_dt, a.end_dt, a.status, a.created_at
        FROM availabilities a
        JOIN users u ON u.id = a.user_id
        ORDER BY a.id DESC
        LIMIT %s
    """, (limit,))
    rows = cur.fetchall()
    cols = ["id","name","date","start_dt","end_dt","status","created_at"]
    return jsonify([dict(zip(cols, r)) for r in rows])

@app.post("/api/availabilities")
def upsert_availabilities():
    data = request.get_json(force=True)
    line_user_id = data.get("line_user_id", "dev-user")
    items = data.get("items", [])

    con = get_db()
    cur = con.cursor()

    # ユーザーを確定する、なければ作成する
    cur.execute("SELECT id FROM users WHERE line_user_id=%s", (line_user_id,))
    row = cur.fetchone()
    if not row:
        cur.execute("INSERT INTO users(name,line_user_id) VALUES(%s,%s)",
                    ("Dev User", line_user_id))
        cur.execute("SELECT id FROM users WHERE line_user_id=%s", (line_user_id,))
        row = cur.fetchone()
    uid = row[0]

    for it in items:
        cur.execute("""
            INSERT INTO availabilities(user_id,date,start_dt,end_dt,status)
            VALUES(%s,%s,%s,%s,%s)
            ON DUPLICATE KEY UPDATE
              status=VALUES(status),
              date=VALUES(date)
        """, (
            uid,
            it["date"],
            datetime.fromisoformat(it["start"]),
            datetime.fromisoformat(it["end"]),
            it["status"],
        ))
    return {"ok": True}, 201
