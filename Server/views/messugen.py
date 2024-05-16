from flask import current_app
from models.db import queryDb, getAvgFromDay
from flask import Blueprint, render_template, request

blueprint = Blueprint(
    "messugen_bp",
    __name__,
    url_prefix="/messungen/"
)

@blueprint.get("/")
def dashboard_diagramme():
    return render_template("pages/messungen.html")
    
@blueprint.route("/<raw_date>")
def date_route(raw_date):
    try: limit = request.args["limit"]
    except: limit = current_app.config["DEFAULT_MESSUNG_LIMIT"]
    
    formattedDate = " ".join(raw_date.split("_"))
    formattedDateLength = len(formattedDate.split(" "))
    
    data = queryDb(
        "select * from wetterdaten where entry_date like ? order by entry_id desc limit ?",
        ["%{}%".format(formattedDate), limit]
    )
    if len(data) == 1 and formattedDateLength == 2:
        print(data)
        
        date_for_avg_data = formattedDate.split(" ")[0] + " 00:00:00"
        avg_data = getAvgFromDay(date_for_avg_data)
        print(avg_data)
                
        data_gas = queryDb(
            "select round(avg(red), 2) as avg_red, round(avg(oxi), 2) as avg_oxi, round(avg(nh3), 2) as avg_nh3 from gas where entry_date between Date(?, '-1 minute') and ?",
            [formattedDate, formattedDate]
        )
        print("gas: ", data_gas)
        
        return render_template(
            "pages/messungen.html",
            entry_data=data,
            date=formattedDate,
            avg_day=avg_data,
            data_gas=data_gas,
            type="content-entry"
        )
    
    return render_template(
        "pages/messungen.html",
        entry_data=data,
        date=formattedDate,
        results=len(data),
        type="content-table"
    )