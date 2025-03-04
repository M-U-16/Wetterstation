# librarys and stdlib
import datetime
from flask import current_app
from markupsafe import escape
from datetime import datetime
from flask import Blueprint, render_template, request

# internal
from models import db
from helpers.MessDate import DatetimeInfo

blueprint = Blueprint(
    "messungen_bp",
    __name__,
    url_prefix="/messungen/"
)

@blueprint.get("/")
def dashboard_diagramme():
    
    
    #data_gas = db.getAvgGasLastMinuteToday()
    #print("gas: ", data_gas)
    
    #data_all = db.getAvgDataFromToday()
    #print(data_all)
    
    date = datetime.now()
    print(str(date))
    return render_template(
        "pages/messungen.html",
        entry_data="1",
        messungen=80,
        date=date.strftime("%d.%m.%Y"),
        type="content-day",
        query="Heute"
        #avg_day=avg_data,
        #entry_gas=data_gas,
    )

@blueprint.route("/")
def date_route():
    try: limit = request.args["limit"]
    except: limit = current_app.config["DEFAULT_MESSUNG_LIMIT"]
    
    
    """ if len(data) > 1 and not inputDate.date.isComplete:
        return render_template(
            "pages/messungen.html",
            entry_data=data,
            date=escape(str(inputDate)),
            results=len(data),
            type="content-table"
        )
    
    avg_data = db.getAvgFromDay(str(inputDate))
    data_gas = db.getAvgGasLastMinute(str(inputDate)) """
    #hello.
    
        
    """ if inputDate.date.isComplete and inputDate.time.isComplete:
        return render_template(
            "pages/messungen.html",
            entry_data=data,
            date=escape(str(inputDate)),
            avg_day=avg_data,
            entry_gas=data_gas,
            type="content-entry",
        )
        
    return render_template(
        "pages/messungen.html",
        date=escape(str(inputDate)),
        type="content-none"
    ) """