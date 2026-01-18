from flask import Blueprint, jsonify, request
from app.database import get_db
from datetime import datetime, timedelta

bp = Blueprint("staff", __name__, url_prefix="/api/staff")

@bp.get("/patterns")
def list_patterns():
    # Mock patterns for now, implementing DB later if needed
    return jsonify({"ok": True, "items": []})

@bp.post("/patterns")
def create_pattern():
    return jsonify({"ok": True})

@bp.post("/availability")
def update_availability():
    """
    Submits availability for a list of dates.
    body: { "user_id": 1, "items": [{date, start, end, status}] }
    """
    body = request.json or {}
    user_id = body.get("user_id") #In real app, get from session
    items = body.get("items", [])

    if not user_id or not items:
        return jsonify({"ok": False, "error": "invalid data"}), 400

    with get_db() as conn, conn.cursor() as cur:
        sql = """
            INSERT INTO availabilities(user_id, date, start_time, end_time, status, note)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE status=VALUES(status), note=VALUES(note)
        """
        params = []
        for it in items:
            params.append((
                user_id,
                it["date"],
                it["start"],
                it["end"],
                it.get("status", "can"),
                it.get("note", "")
            ))

        cur.executemany(sql, params)

    return jsonify({"ok": True})
