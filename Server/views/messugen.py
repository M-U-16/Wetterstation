# librarys and stdlib
import os
import datetime
from flask import current_app, send_file
from datetime import datetime
from flask import Blueprint, render_template, request

# internal
from models import get_db

blueprint = Blueprint(
    "messungen_bp",
    __name__,
    url_prefix="/messungen/"
)

def get_extrema(cur, from_date, to_date):
    return {
        "max_humi": dict(cur.execute(
            """SELECT entry_date, MAX(humi) as humi FROM wetterdaten WHERE entry_date BETWEEN strftime('%Y-%m-%d 00:00:00', ?) 
            AND strftime('%Y-%m-%d 23:59:59', ?) ORDER BY entry_id ASC""",
            (from_date, to_date)
        ).fetchone()),
        "min_humi": dict(cur.execute(
            """SELECT entry_date, MIN(humi) as humi FROM wetterdaten WHERE entry_date BETWEEN strftime('%Y-%m-%d 00:00:00', ?) 
            AND strftime('%Y-%m-%d 23:59:59', ?) ORDER BY entry_id ASC""",
            (from_date, to_date)
        ).fetchone()),
        "max_temp": dict(cur.execute(
            """SELECT entry_date, MAX(temp) as temp FROM wetterdaten WHERE entry_date BETWEEN strftime('%Y-%m-%d 00:00:00', ?) 
            AND strftime('%Y-%m-%d 23:59:59', ?) ORDER BY entry_id ASC""",
            (from_date, to_date)
        ).fetchone()),
        "min_temp": dict(cur.execute(
            """SELECT entry_date, MIN(temp) as temp FROM wetterdaten WHERE entry_date BETWEEN strftime('%Y-%m-%d 00:00:00', ?) 
            AND strftime('%Y-%m-%d 23:59:59', ?) ORDER BY entry_id ASC""",
            (from_date, to_date)
        ).fetchone())
    }

@blueprint.get("/<file>")
def messungen_test(file):
    return send_file(os.path.join(current_app.root_path, "samples", file))

@blueprint.get("/")
def messungen(): 
    date = datetime.now().strftime("%Y-%m-%d")
    #print(date)
    date = "2025-02-28"
    
    _, cursor = get_db()
    
    #get all entries from today
    data = cursor.execute(
        "SELECT * FROM wetterdaten WHERE entry_date BETWEEN strftime('%Y-%m-%d 00:00:00', ?)"+
        "AND strftime('%Y-%m-%d 23:59:59', ?) ORDER BY entry_id asc",
        ("2024-01-01 00:00:00", "2024-12-30 23:00:00")
    ).fetchall()
    # print(data)
    if not data: data = []
    
    #print(dict(data))
    return render_template(
        "pages/messungen.html",
        entry_data=data,
        last_entry="2024-05-01 10:20:10",#data[-1]["entry_date"],
        messungen=len(data),
        date=date,
        extrema=get_extrema(cursor, "2024-01-01 00:00:00", "2024-12-30 23:00:00"),
        query="Heute"
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