import os
from datetime import datetime
from flask import Flask, request
from flask_cors import CORS

# MySQLドライバ: mysqlclient(=MySQLdb) が無い環境の保険に PyMySQL へ自動フォールバック
try:
    import MySQLdb as mysql
except ModuleNotFoundError:
    import pymysql as mysql

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

DB = mysql.connect(
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

