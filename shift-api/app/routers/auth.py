from flask import Blueprint, request, jsonify

bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# Mock Auth for Prototype
# In production, use bcrypt and proper session/JWT

@bp.post("/login")
def login():
    """
    Very simple mock login.
    Accepts any email. Returns mock user data.
    """
    body = request.json or {}
    email = body.get("email", "")

    if "admin" in email or "manager" in email:
        return jsonify({
            "ok": True,
            "user": {"id": 1, "name": "Manager User", "role": "manager", "email": email}
        })
    else:
        return jsonify({
            "ok": True,
            "user": {"id": 2, "name": "Staff User", "role": "crew", "email": email}
        })

@bp.get("/me")
def me():
    # Stateless mock for now
    return jsonify({"ok": True, "user": None})
