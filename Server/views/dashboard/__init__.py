from flask import Blueprint, render_template

blueprint = Blueprint(
    "dashboard_bp",
    __name__,
    url_prefix=""
)

@blueprint.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")