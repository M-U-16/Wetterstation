# librarys and stdlib
import datetime
import os
from flask import current_app, send_file
from markupsafe import escape
from datetime import datetime
from flask import Blueprint, render_template, request

# internal
from models import db, get_db

blueprint = Blueprint(
    "messungen_bp",
    __name__,
    url_prefix="/messungen/"
)

@blueprint.get("/<file>")
def messungen_test(file):
    return send_file(os.path.join(current_app.root_path, "samples", file))

@blueprint.get("/")
def messungen():
    #data_gas = db.getAvgGasLastMinuteToday()
    #print("gas: ", data_gas)
    
    #data_all = db.getAvgDataFromToday()
    #print(data_all)
    
    date = datetime.now().strftime("%Y-%m-%d")
    print(date)
    date = "2025-02-28"
    
    db = get_db()
    cursor = db.cursor()
    
    #get all entries from today
    data = cursor.execute(
        "SELECT * FROM wetterdaten WHERE entry_date BETWEEN strftime('%Y-%m-%d 00:00:00', ?)"+
        "AND strftime('%Y-%m-%d 23:59:59', ?) ORDER BY entry_id asc",
        (date, date)
    ).fetchall()
    
    return render_template(
        "pages/messungen.html",
        entry_data=data,
        last_entry=data[-1]["entry_date"],
        messungen=len(data),
        date=date,
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