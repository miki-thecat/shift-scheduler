import io
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from flask import Blueprint, jsonify, request, send_file
from app.database import get_db

bp = Blueprint("manager", __name__, url_prefix="/api")

def month_range(yyyy_mm):
    first = datetime.strptime(yyyy_mm + "-01", "%Y-%m-%d").date()
    last = (first + relativedelta(months=1)) - timedelta(days=1)
    return first, last

@bp.get("/periods")
def list_periods():
    with get_db() as conn, conn.cursor() as cur:
        cur.execute("SELECT * FROM periods ORDER BY month DESC")
        rows = cur.fetchall()
    return jsonify({"ok": True, "items": rows})

@bp.post("/periods")
def create_period():
    body = request.json or {}
    month = body.get("month")
    name = body.get("name") or month
    deadline = body.get("deadline")

    with get_db() as conn, conn.cursor() as cur:
        cur.execute("""INSERT INTO periods(name, month, deadline) VALUES(%s,%s,%s)
                       ON DUPLICATE KEY UPDATE name=VALUES(name), deadline=VALUES(deadline)""",
                    (name, month, deadline))
        cur.execute("SELECT * FROM periods WHERE month=%s", (month,))
        row = cur.fetchone()
    return jsonify({"ok": True, "period": row})

# Optimized Overview using bulk fetch
@bp.get("/overview")
def overview():
    period_id = request.args.get("period_id")
    if not period_id: return jsonify({"error": "period_id req"}), 400

    with get_db() as conn, conn.cursor() as cur:
        cur.execute("SELECT * FROM periods WHERE id=%s", (period_id,))
        per = cur.fetchone()
        if not per: return jsonify({"error": "not found"}), 404
        first, last = month_range(per["month"])

        # 1. Fetch Users
        cur.execute("SELECT id, name FROM users ORDER BY id")
        users = cur.fetchall()

        # 2. Fetch All Availabilities in range (Bulk)
        # N+1 Prevention: Getting all needed data in 1 query instead of looping users
        cur.execute("""
            SELECT user_id, date, status
            FROM availabilities
            WHERE date BETWEEN %s AND %s
        """, (first, last))
        avs = cur.fetchall()

        # Map (user_id, date) -> best_status
        rank = {"prefer":3, "can":2, "cannot":1}
        best = {}
        for a in avs:
            key = (a["user_id"], a["date"])
            if key not in best or rank[a.get("status")] > rank[best[key]]:
                best[key] = a.get("status")

        # 3. Build Response Grid
        days = []
        d = first
        while d <= last:
            days.append(d.isoformat())
            d += timedelta(days=1)

        sym = {"prefer":"○","can":"△","cannot":"×"}
        rows = []
        for u in users:
            row = {"user": u["name"], "cells": []}
            for ds in days:
                dd = datetime.strptime(ds, "%Y-%m-%d").date()
                st = best.get((u["id"], dd))
                row["cells"].append(sym.get(st, ""))
            rows.append(row)

    return jsonify({"ok": True, "period": per, "days": days, "rows": rows})

@bp.post("/slots/generate")
def generate_slots():
    # Logic similar to original app.py but cleaner
    period_id = request.args.get("period_id")
    needed = int(request.args.get("needed", "1"))

    with get_db() as conn, conn.cursor() as cur:
        # Get period dates
        cur.execute("SELECT month FROM periods WHERE id=%s", (period_id,))
        res = cur.fetchone()
        if not res: return jsonify({"ok": False}), 404
        first, last = month_range(res["month"])

        # Insert slots
        spans = [("09:00","13:00"), ("13:00","18:00"), ("18:00","22:00")]
        gen = 0
        d = first
        while d <= last:
            for s,e in spans:
                cur.execute("""
                    INSERT IGNORE INTO slots(period_id,date,start_time,end_time,needed_count)
                    VALUES(%s,%s,%s,%s,%s)
                """, (period_id, d, s, e, needed))
                gen += cur.rowcount
            d += timedelta(days=1)

    return jsonify({"ok": True, "generated": gen})
