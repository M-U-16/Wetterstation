from re import escape
from flask import Blueprint, flash, jsonify, make_response, redirect, render_template, request, session, url_for

from models import formatResponse
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
    
    db = get_meta_db()
    cursor = db.cursor()
    
    settings = []
    
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
    
    return render_template(
        "pages/admin.html",
        settings=settings
    )

@blueprint.post("/")
def admin_login():
    if request.form["password"] == "1234":
        session["is_admin"] = True
        flash("Erfolgreich Angemeldet!", category="success")
    else:
        flash(
            "Passwort inkorrekt!",
            category="error"
        )
    return redirect(url_for("admin_bp.admin"))

@blueprint.get("/logout")
def admin_logout():
    session["is_admin"] = False
    flash("Erfolgreich Abgemeldet!", category="success")
    
    path_filter = filter(lambda x: x != "", request.referrer.split("/"))
    referrer_path = "/" + list(path_filter)[-1]
    if referrer_path in "/admin":
        return redirect("/")
    
    return redirect(escape(referrer_path))