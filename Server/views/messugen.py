import os
from models.db import queryDb
from flask import Blueprint, render_template, request

blueprint = Blueprint(
    "messugen_bp",
    __name__,
    url_prefix="/messungen/"
)

@blueprint.get("/")
def dashboard_diagramme():
    return render_template(
        "pages/messungen.html",
    )
    
@blueprint.route("/<date>")
def date_route(date):
    try: limit = request.args["limit"]
    except: limit = os.getenv("DEFAULT_MESSUNG_LIMIT")
    
    formattedDate = " ".join(date.split("_"))
    data = queryDb(
        "select * from wetterdaten where entry_date like ? limit ?",
        ["%{}%".format(formattedDate), limit]
    )
    if len(data) == 0: return "<h1>Error</h1>"
    
    return render_template(
        "pages/messungen.html",
        entry_data=data
    )