from flask import Blueprint, render_template
blueprint = Blueprint("suchen_bp", __name__, url_prefix="/suchen")

@blueprint.get("/")
def dashboard_search():
    return render_template(
        "dashboard/search.html",
        active_content="suchen"
    )