from datetime import datetime
from models.db import getLastEntry
from flask import Blueprint, render_template

blueprint = Blueprint("dashboard_bp", __name__, url_prefix="/dashboard")

@blueprint.get("/")
def dashboard():
    #result =  getLastEntry()[0]
    """ result["date"] = (datetime
        .strptime(result["date"], '%Y-%m-%d %H:%M:%S')
        .strftime("%d.%m.%Y %H:%M:%S")
    ) """
    return render_template(
        "pages/dashboard.html",
        last_entry="result"
    )