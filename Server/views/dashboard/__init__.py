from flask import Blueprint, render_template, request
from models.db import getLastEntry
from datetime import date, datetime

blueprint = Blueprint("dashboard_bp",__name__,url_prefix="")
views = {
    "diagramme": "dashboard/chart.html",
    "live-daten": "dashboard/live.html",
    "suchen": "dashboard/search.html"
}

@blueprint.route("/dashboard")
def dashboard():
    try: 
        view_param = request.args["ansicht"]
        view = views[view_param]
    except:
        result =  getLastEntry()[0]
        result["entry_date"] = (datetime
            .strptime(result["entry_date"], '%Y-%m-%d %H:%M:%S')
            .strftime("%d.%m.%Y %H:%M:%S")
        )
        return render_template(
            "dashboard/dashboard.html",
            last_entry=result
        )
    return render_template(view, active_content=view_param)
    