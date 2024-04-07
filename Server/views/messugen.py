from flask import Blueprint, render_template
blueprint = Blueprint("messugen_bp", __name__, url_prefix="/messungen")

@blueprint.get("/")
def dashboard_diagramme():
    return render_template(
        "dashboard/chart.html",
        active_content="messungen"
    )