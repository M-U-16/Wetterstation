import json
from models import get_db
from models.db import addEntry
from flask import Blueprint, jsonify, request

wetterdaten_route = Blueprint("wetterdaten_route", __name__)

queries_date_range = {
    "1d": "SELECT * FROM wetterdaten WHERE DATE(entry_date) = DATE('now')",
    "1w": "SELECT * FROM wetterdaten WHERE DATE(entry_date) BETWEEN DATE('now', '-7 days') AND DATETIME('now')",
    "1m": "SELECT * FROM wetterdaten WHERE DATE(entry_date) BETWEEN DATE('now', '-1 month') AND DATETIME('now')",
    "1y": "SELECT * FROM wetterdaten WHERE DATETIME(entry_date) BETWEEN DATE('now', '-1 year') AND DATETIME('now')",
}

@wetterdaten_route.get("/wetterdaten")
def get_wetterdaten():
    _, cur = get_db()
    
    date_range = request.args.get("range")
    date = request.args.get("date")
    date_from = request.args.get("from")
    date_to = request.args.get("to")
    
    sql_query = ""    
    if date_range:
        sql_query = queries_date_range.get(date_range)
        if not sql_query: return jsonify({"error": True, "text": "Bad Request"}), 400
        wetterdata = cur.execute(sql_query).fetchall()
        wetterdata = [dict(data) for data in wetterdata]
    elif date:
        sql_query = "SELECT * FROM wetterdaten WHERE DATE(entry_date) = DATE(?)"
        wetterdata = cur.execute(sql_query, [date])
        wetterdata = [dict(data) for data in wetterdata]
    elif date_from and date_to:
        sql_query = "SELECT * FROM wetterdaten WHERE entry_date BETWEEN DATE(?) AND DATETIME(?, '23:59:59')"
        wetterdata = cur.execute(sql_query, [date_from, date_to]).fetchall()
        wetterdata = [dict(data) for data in wetterdata]
    else:
        wetterdata = cur.execute(queries_date_range["1d"]).fetchall()
        wetterdata = [dict(data) for data in wetterdata]
    #print(wetterdata)
    
    return jsonify({"error": False, "data": wetterdata})

@wetterdaten_route.post('/wetterdaten')
def post_wetterdaten():
    db, cur = get_db()
    
    #database
    data = request.get_json()
    print(data)
    
    #addEntry(data)
    #handling response
    print("wetterdaten erhalten!")
    return jsonify({ "message": "ADDED_ENTRY" })
    
