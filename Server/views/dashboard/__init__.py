from datetime import datetime
from models.db import getLastEntry
from flask import Blueprint, render_template

blueprint = Blueprint("dashboard_bp", __name__, url_prefix="/dashboard")

@blueprint.get("/live")
def dashboard_live():
    return render_template(
        "dashboard/live.html",
        active_content="live"
    )

@blueprint.get("/messungen")
def dashboard_diagramme():
    return render_template(
        "dashboard/chart.html",
        active_content="messungen"
    )

@blueprint.get("/suchen")
def dashboard_search():
    return render_template(
        "dashboard/search.html",
        active_content="suchen"
    )

@blueprint.get("/")
def dashboard():
    result =  getLastEntry()[0]
    result["entry_date"] = (datetime
        .strptime(result["entry_date"], '%Y-%m-%d %H:%M:%S')
        .strftime("%d.%m.%Y %H:%M:%S")
    )
    return render_template(
        "dashboard/dashboard.html",
        last_entry=result
    )