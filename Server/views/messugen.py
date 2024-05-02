from flask import Blueprint, render_template
from models.db import getDate

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
    print(date)
    formattedDate = " ".join(date.split("_"))
    
    data = getDate(formattedDate)
    print(data)
    if len(data) == 0: return "<h1>Error</h1>"
    
    return render_template(
        "pages/messungen.html",
        entry_data=data[0]
    )