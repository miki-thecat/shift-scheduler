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

# ---------- utils ----------
def month_range(yyyy_mm: str):
    first = datetime.strptime(yyyy_mm + "-01", "%Y-%m-%d").date()
    last = (first + relativedelta(months=1)) - timedelta(days=1)
    return first, last

def ensure_tables():
    ddl = """
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255),
      line_user_id VARCHAR(64) UNIQUE,
      role ENUM('manager','crew') DEFAULT 'crew',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS periods (
      id BIGINT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100),
      month CHAR(7) NOT NULL,
      deadline DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_month (month)
    );
    CREATE TABLE IF NOT EXISTS period_notes (
      id BIGINT PRIMARY KEY AUTO_INCREMENT,
      period_id BIGINT NOT NULL,
      user_id BIGINT,
      note VARCHAR(255),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX(period_id), INDEX(user_id)
    );
    CREATE TABLE IF NOT EXISTS availabilities (
      id BIGINT PRIMARY KEY AUTO_INCREMENT,
      user_id BIGINT NOT NULL,
      date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      status ENUM('prefer','can','cannot') NOT NULL DEFAULT 'can',
      note VARCHAR(255),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_user_slot (user_id, date, start_time, end_time),
      INDEX(user_id), INDEX(date)
    );
    CREATE TABLE IF NOT EXISTS slots (
      id BIGINT PRIMARY KEY AUTO_INCREMENT,
      period_id BIGINT NOT NULL,
      date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      needed_count INT NOT NULL DEFAULT 1,
      UNIQUE KEY uniq_slot (period_id, date, start_time, end_time),
      INDEX(period_id), INDEX(date)
    );
    CREATE TABLE IF NOT EXISTS assignments (
      id BIGINT PRIMARY KEY AUTO_INCREMENT,
      slot_id BIGINT NOT NULL,
      user_id BIGINT NOT NULL,
      assigned_by ENUM('ai','manual') DEFAULT 'ai',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_slot_user (slot_id, user_id),
      INDEX(user_id), INDEX(slot_id)
    );
    """
    with db() as conn, conn.cursor() as cur:
        for stmt in ddl.split(";"):
            s = stmt.strip()
            if s: cur.execute(s)


# ---------- health ----------
@app.get("/health")
def health():
    return jsonify({"ok": True})

# ---------- periods ----------
@app.post("/api/periods")
def create_period():
    """body: { "month": "2025-08", "name": "2025年8月", "deadline": "2025-08-25" }"""
    body = request.get_json(force=True)
    month = body["month"]
    name = body.get("name") or month
    deadline = body.get("deadline")
    with db() as conn, conn.cursor() as cur:
        cur.execute("""INSERT INTO periods(name, month, deadline)
                       VALUES(%s,%s,%s)
                       ON DUPLICATE KEY UPDATE name=VALUES(name), deadline=VALUES(deadline)""",
                    (name, month, deadline))
        cur.execute("SELECT * FROM periods WHERE month=%s", (month,))
        row = cur.fetchone()
    return jsonify({"ok": True, "period": row}), 201

@app.get("/api/periods")
def list_periods():
    with db() as conn, conn.cursor() as cur:
        cur.execute("SELECT * FROM periods ORDER BY month DESC")
        rows = cur.fetchall()
    return jsonify({"ok": True, "items": rows})

# ---------- availabilities ----------
@app.post("/api/availabilities")
def upsert_availabilities():
    """
    body:
    {
      "line_user_id": "dev-user",
      "items": [
        {"date":"2025-08-18", "start_time":"09:00", "end_time":"13:00",
         "status":"prefer", "note":""}
      ]
    }
    """
    b = request.get_json(force=True)
    line_user_id = b.get("line_user_id") or "dev-user"
    items = b.get("items", [])
    if not items:
        return jsonify({"ok": False, "error": "items required"}), 400

    with db() as conn, conn.cursor() as cur:
        # user ensure
        cur.execute("SELECT id FROM users WHERE line_user_id=%s", (line_user_id,))
        row = cur.fetchone()
        if not row:
            cur.execute("INSERT INTO users(name, line_user_id) VALUES(%s,%s)",
                        ("Dev User", line_user_id))
            cur.execute("SELECT id FROM users WHERE line_user_id=%s", (line_user_id,))
            row = cur.fetchone()
        user_id = row["id"]

        for it in items:
            d = datetime.strptime(it["date"], "%Y-%m-%d").date()
            st = datetime.strptime(it["start_time"], "%H:%M").time()
            et = datetime.strptime(it["end_time"], "%H:%M").time()
            if et <= st:
                return jsonify({"ok": False, "error": "end_time must be after start_time"}), 400
            status = it.get("status", "can")
            note = it.get("note")
            cur.execute("""
                INSERT INTO availabilities(user_id,date,start_time,end_time,status,note)
                VALUES(%s,%s,%s,%s,%s,%s)
                ON DUPLICATE KEY UPDATE status=VALUES(status), note=VALUES(note)
            """, (user_id, d, st, et, status, note))

    return jsonify({"ok": True}), 201

@app.get("/api/availabilities")
def list_availabilities():
    period_id = request.args.get("period_id")
    line_user_id = request.args.get("line_user_id")
    where, params = [], []
    if period_id:
        with db() as conn, conn.cursor() as cur:
            cur.execute("SELECT month FROM periods WHERE id=%s", (period_id,))
            p = cur.fetchone()
        if not p:
            return jsonify({"ok": False, "error": "period not found"}), 404
        first, last = month_range(p["month"])
        where.append("a.date BETWEEN %s AND %s")
        params += [first, last]
    if line_user_id:
        where.append("u.line_user_id=%s")
        params.append(line_user_id)

    sql = """
    SELECT a.id, u.name, u.line_user_id, a.date, a.start_time, a.end_time, a.status, a.note
    FROM availabilities a JOIN users u ON u.id=a.user_id
    """
    if where:
        sql += " WHERE " + " AND ".join(where)
    sql += " ORDER BY a.date, a.start_time, u.id"

    with db() as conn, conn.cursor() as cur:
        cur.execute(sql, params)
        rows = cur.fetchall()
    return jsonify({"ok": True, "items": rows})

# ---------- overview (grid for /overview) ----------
@app.get("/api/overview")
def overview():
    """Return grid: rows=users, cols=dates; cell=○/△/× (best of the day)"""
    period_id = request.args.get("period_id")
    if not period_id:
        return jsonify({"ok": False, "error": "period_id is required"}), 400
    with db() as conn, conn.cursor() as cur:
        cur.execute("SELECT * FROM periods WHERE id=%s", (period_id,))
        per = cur.fetchone()
        if not per:
            return jsonify({"ok": False, "error": "period not found"}), 404
        first, last = month_range(per["month"])

        cur.execute("SELECT id, name FROM users ORDER BY id")
        users = cur.fetchall()
        uid_idx = {u["id"]: i for i, u in enumerate(users)}

        # availability by day (pick best status per user/day)
        cur.execute("""
          SELECT user_id, date, status
          FROM availabilities
          WHERE date BETWEEN %s AND %s
        """, (first, last))
        avs = cur.fetchall()
        rank = {"prefer":3, "can":2, "cannot":1}
        best = {}
        for a in avs:
            key = (a["user_id"], a["date"])
            if key not in best or rank[a["status"]] > rank[best[key]]:
                best[key] = a["status"]

        # daily slot needs & assignments
        cur.execute("""
          SELECT date, SUM(needed_count) AS needed
          FROM slots WHERE period_id=%s GROUP BY date
        """, (period_id,))
        needs = {r["date"]: r["needed"] or 0 for r in cur.fetchall()}

        cur.execute("""
          SELECT s.date, COUNT(*) AS assigned
          FROM assignments x JOIN slots s ON s.id=x.slot_id
          WHERE s.period_id=%s GROUP BY s.date
        """, (period_id,))
        filled = {r["date"]: r["assigned"] or 0 for r in cur.fetchall()}

    # build days
    days = []
    d = first
    while d <= last:
        days.append(d.isoformat())
        d += timedelta(days=1)

    # matrix of ○/△/×
    sym = {"prefer":"○","can":"△","cannot":"×"}
    rows = []
    for u in users:
        row = {"user": u["name"], "cells": []}
        for ds in days:
            dd = datetime.strptime(ds, "%Y-%m-%d").date()
            st = best.get((u["id"], dd))
            row["cells"].append(sym.get(st, ""))
        rows.append(row)

    # header stats
    need_list = [ needs.get(datetime.strptime(ds, "%Y-%m-%d").date(), 0) for ds in days ]
    fill_list = [ filled.get(datetime.strptime(ds, "%Y-%m-%d").date(), 0) for ds in days ]
    rate_list = [ (f/n if n else 0) for f,n in zip(fill_list, need_list) ]

    return jsonify({
        "ok": True,
        "period": per,
        "days": days,
        "rows": rows,
        "needs": need_list,
        "fills": fill_list,
        "rates": rate_list
    })

# ---------- slots generate ----------
@app.post("/api/slots/generate")
def generate_slots():
    """?period_id=&needed=2  固定スロット 09-13, 13-18, 18-22"""
    period_id = request.args.get("period_id")
    needed = int(request.args.get("needed", "1"))
    if not period_id:
        return jsonify({"ok": False, "error": "period_id is required"}), 400

    with db() as conn, conn.cursor() as cur:
        cur.execute("SELECT month FROM periods WHERE id=%s", (period_id,))
        per = cur.fetchone()
        if not per:
            return jsonify({"ok": False, "error": "period not found"}), 404
        first, last = month_range(per["month"])
        spans = [("09:00","13:00"), ("13:00","18:00"), ("18:00","22:00")]

        d = first
        gen = 0
        while d <= last:
            for s,e in spans:
                cur.execute("""
                  INSERT IGNORE INTO slots(period_id,date,start_time,end_time,needed_count)
                  VALUES(%s,%s,%s,%s,%s)
                """, (period_id, d, s, e, needed))
                gen += cur.rowcount
            d += timedelta(days=1)
    return jsonify({"ok": True, "generated": gen})

# ---------- assign (greedy) ----------
@app.post("/api/assign/greedy")
def assign_greedy():
    """period内の各スロットに、prefer優先→can。割当回数の少ない人から充当。"""
    period_id = request.args.get("period_id")
    if not period_id:
        return jsonify({"ok": False, "error": "period_id is required"}), 400

    with db() as conn, conn.cursor() as cur:
        cur.execute("""SELECT * FROM slots WHERE period_id=%s ORDER BY date, start_time""", (period_id,))
        slots = cur.fetchall()
        if not slots:
            return jsonify({"ok": False, "error": "no slots"}), 400

        # availability: 同日かつ時間をカバーしている人
        cur.execute("""
          SELECT a.user_id, a.date, a.start_time, a.end_time, a.status
          FROM availabilities a
          WHERE a.date IN (SELECT DISTINCT date FROM slots WHERE period_id=%s)
        """, (period_id,))
        avs = cur.fetchall()
        by_date = {}
        for a in avs:
            by_date.setdefault(a["date"], []).append(a)

        cur.execute("""SELECT user_id, COUNT(*) cnt
                       FROM assignments x JOIN slots s ON s.id=x.slot_id
                       WHERE s.period_id=%s GROUP BY user_id""", (period_id,))
        counts = {r["user_id"]: r["cnt"] for r in cur.fetchall()}

        created = 0
        for sl in slots:
            cand_pref, cand_can = [], []
            for a in by_date.get(sl["date"], []):
                # 時間包含判定
                if a["start_time"] <= sl["start_time"] and a["end_time"] >= sl["end_time"]:
                    (cand_pref if a["status"]=="prefer" else
                     cand_can if a["status"]=="can" else []).append(a["user_id"])

            def sort_fair(lst): return sorted(lst, key=lambda uid: counts.get(uid, 0))
            picks = []
            for uid in sort_fair(cand_pref) + sort_fair(cand_can):
                if uid in picks: continue
                picks.append(uid)
                if len(picks) >= sl["needed_count"]:
                    break

            for uid in picks:
                cur.execute("""INSERT IGNORE INTO assignments(slot_id,user_id,assigned_by)
                               VALUES(%s,%s,'ai')""", (sl["id"], uid))
                if cur.rowcount:
                    counts[uid] = counts.get(uid, 0) + 1
                    created += 1
    return jsonify({"ok": True, "created": created})

# ---------- excel export ----------
@app.get("/api/export/excel")
def export_excel():
    period_id = request.args.get("period_id")
    if not period_id:
        return jsonify({"ok": False, "error": "period_id is required"}), 400

    with db() as conn, conn.cursor() as cur:
        cur.execute("SELECT * FROM periods WHERE id=%s", (period_id,))
        per = cur.fetchone()
        if not per:
            return jsonify({"ok": False, "error": "period not found"}), 404
        first, last = month_range(per["month"])

        cur.execute("SELECT id, name FROM users ORDER BY id")
        users = cur.fetchall()
        uid_idx = {u["id"]: i for i,u in enumerate(users)}

        # best status per user/day
        cur.execute("""
          SELECT user_id, date, status FROM availabilities
          WHERE date BETWEEN %s AND %s
        """, (first, last))
        avs = cur.fetchall()
        rank = {"prefer":3, "can":2, "cannot":1}
        best = {}
        for a in avs:
            key = (a["user_id"], a["date"])
            if key not in best or rank[a["status"]] > rank[best[key]]:
                best[key] = a["status"]

        cur.execute("""
          SELECT date, SUM(needed_count) AS needed
          FROM slots WHERE period_id=%s GROUP BY date
        """, (period_id,))
        needs = {r["date"]: r["needed"] or 0 for r in cur.fetchall()}

        cur.execute("""
          SELECT s.date, COUNT(*) AS assigned
          FROM assignments x JOIN slots s ON s.id=x.slot_id
          WHERE s.period_id=%s GROUP BY s.date
        """, (period_id,))
        fills = {r["date"]: r["assigned"] or 0 for r in cur.fetchall()}

        cur.execute("""
          SELECT pn.*, u.name AS user_name
          FROM period_notes pn LEFT JOIN users u ON u.id=pn.user_id
          WHERE pn.period_id=%s
        """, (period_id,))
        notes = cur.fetchall()

    # days
    days = []
    d = first
    while d <= last:
        days.append(d)
        d += timedelta(days=1)

    # matrix
    sym = {"prefer":"○","can":"△","cannot":"×"}
    import xlsxwriter
    buf = io.BytesIO()
    wb = xlsxwriter.Workbook(buf, {"in_memory": True})
    ws = wb.add_worksheet("Schedule")
    bold = wb.add_format({"bold": True})
    center = wb.add_format({"align": "center", "valign": "vcenter"})

    # headers: row0 dates, row1 needed, row2 fill-rate
    ws.write(0, 0, "人＼日付", bold)
    ws.write(1, 0, "必要人数", bold)
    ws.write(2, 0, "充足率", bold)

    for c, day in enumerate(days, start=1):
        ws.write(0, c, day.strftime("%m/%d"), bold)
        need = needs.get(day, 0)
        fill = fills.get(day, 0)
        rate = (fill/need) if need else 0
        ws.write(1, c, need, center)
        ws.write(2, c, f"{rate:.0%}", center)

    # body
    for r, u in enumerate(users, start=3):
        ws.write(r, 0, u["name"], bold)
        for c, day in enumerate(days, start=1):
            st = best.get((u["id"], day))
            ws.write(r, c, sym.get(st, ""), center)

    # Notes sheet
    ns = wb.add_worksheet("Notes")
    ns.write(0, 0, f"Period: {per['name'] or per['month']}", bold)
    ns.write(1, 0, "User")
    ns.write(1, 1, "Note")
    rr = 2
    for n in notes:
        ns.write(rr, 0, n.get("user_name") or "-")
        ns.write(rr, 1, n.get("note") or "")
        rr += 1

    wb.close()
    buf.seek(0)
    fname = f"shift_{per['month']}.xlsx"
    return send_file(buf, as_attachment=True, download_name=fname,
                     mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

if __name__ == "__main__":
    ensure_tables()
    app.run(host="0.0.0.0", port=8000)
