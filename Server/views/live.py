from flask import Blueprint, render_template
blueprint = Blueprint("live_bp", __name__, url_prefix="/live")

@blueprint.get("/")
def dashboard_live():
    return render_template(
        "pages/live.html",
        active_content="live"
    )