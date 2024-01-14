from flask import Blueprint, render_template, request
from models.db import getLastEntry
from datetime import datetime

blueprint = Blueprint("dashboard_bp",__name__,url_prefix="")
views = {
    "diagramme": "dashboard/chart.html",
    "live-daten": "dashboard/live.html",
    "suchen": "dashboard/search.html"
}

@blueprint.route("/dashboard")
def dashboard():
    try:
        #--------------------------
        #  SETS THE VIEW FOR THE DASHBOARD
        #  AND RAISES AN ERROR WHEN NO
        #  VIEW PARAMETER IS PASSED WITH REQUEST
        #--------------------------
        view_param = request.args["ansicht"]
        view = views[view_param]
    except:
        #--------------------------
        #  RENDERS THE MAIN DASHBOARD
        #  WITH LAST READINGS
        #  WHEN NO VIEW IS DEFINED
        #--------------------------
        result =  getLastEntry()[0]
        result["entry_date"] = (datetime
            .strptime(result["entry_date"], '%Y-%m-%d %H:%M:%S')
            .strftime("%d.%m.%Y %H:%M:%S")
        )
        return render_template(
            "dashboard/dashboard.html",
            last_entry=result
        )
    
    #--------------------------
    #  RENDERS THE VIEW
    #  PASSED IN BY REQUEST
    #  WITH INDICATOR FOR THE ACTIVE
    #  VIEW CONTENT
    #--------------------------
    return render_template(view, active_content=view_param)
    