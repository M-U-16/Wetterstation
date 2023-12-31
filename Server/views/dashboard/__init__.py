from flask import Blueprint, render_template, request
from models.db import getLastEntrys

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
        result =  getLastEntrys()
        entrys = result[0]
        last_id = result[1]
        return render_template(
            "pages/dashboard.html",
            last_entrys=entrys,
            last_id=last_id
        )
    return render_template(view, active_content=view_param)
    