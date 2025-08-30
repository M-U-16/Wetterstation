import json
import dotenv
from flask import Blueprint, current_app, flash, jsonify, make_response, redirect, render_template, request, session, url_for

from models import formatResponse, get_db
from models.meta import get_meta_db
blueprint = Blueprint("admin_bp", __name__, url_prefix="/admin")

def get_setting_dict(list_obj):
    setting_dict = {}
    for item in list_obj:
        setting_dict[item["name"]] = {
            "value": item["value"],
            "extra": item["extra"],
        }
    return setting_dict

@blueprint.get("/")
def admin():
    if not session.get("is_admin"):
        return render_template("pages/admin-login.html")
    
    db, cursor = get_meta_db()
    settings = []
    
    wetter_db, wetter_cur = get_db()
    
    try:
        device_id = cursor.execute(
            "SELECT id FROM device_lookup WHERE device_name=?",
            ("wettereinheit",)
        ).fetchone()["id"]
        
        settings = cursor.execute(
            """
            SELECT setting_name as name, setting_value as value, setting_extra as extra
            FROM device_settings LEFT JOIN
            device_lookup ON device_settings.device_id = device_lookup.id
            WHERE device_settings.device_id=?;
            """,
            (device_id,)
        ).fetchall()
        
        settings = get_setting_dict(formatResponse(settings))
        
        print(settings)
    except Exception as e:
        print(e)
    
    last_entry = None
    try:
        last_entry = wetter_cur.execute("SELECT date FROM wetterdaten ORDER BY entry_id DESC LIMIT 1").fetchone()
        print(type(last_entry), last_entry["date"])
        last_entry = last_entry["date"]
    except Exception as e:
        last_entry = None
        print(e)
        
    return render_template(
        "pages/admin.html",
        settings=settings,
        password=current_app.config["ADMIN_PASSWORD"],
        last_entry=last_entry
    )

@blueprint.post("/")
def admin_login():
    if request.form["password"] == str(current_app.config["ADMIN_PASSWORD"]):
        session["is_admin"] = True
        flash("Erfolgreich Angemeldet!", category="success")
    else:
        flash(
            "Passwort inkorrekt!",
            category="error"
        )
    
    return redirect(url_for("admin_bp.admin"))

@blueprint.post("/change-password")
def admin_change_password():
    if not session.get("is_admin"):
        return jsonify({"error":True}), 404
    
    current_app.config["ADMIN_PASSWORD"] = request.json["password"]
    dotenv.set_key(current_app.config["ENV_FILE"], "FLASK_ADMIN_PASSWORD", request.json["password"])
    return jsonify({"error": False}), 200


@blueprint.get("/logout")
def admin_logout():
    session["is_admin"] = False
    flash("Erfolgreich Abgemeldet!", category="success")
    return redirect("/")