from flask import Blueprint, flash, make_response, redirect, render_template, request, session, url_for
blueprint = Blueprint("admin_bp", __name__, url_prefix="/admin")

@blueprint.get("/")
def admin():
    if not session.get("is_admin"):
        return render_template("pages/admin-login.html")
    else: return render_template("pages/admin.html")

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
    return redirect("/")