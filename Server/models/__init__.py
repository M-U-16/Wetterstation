import os
import sqlite3
from flask import g
from .model import getConnection

def get_db():
    db = getattr(g, "_db", None)
    if db is None:
        db = g._db = getConnection(os.getenv("FLASK_DATABASE"))
    return db, db.cursor()

def close_db(exception):
    db = getattr(g, "_db", None)
    if db is not None:
        print("closing data db")
        db.close()

queries_date_range = {
    "1d": "SELECT * FROM wetterdaten WHERE DATE(entry_date) = DATE('now')",
    "1w": "SELECT * FROM wetterdaten WHERE DATE(entry_date) BETWEEN DATE('now', '-7 days') AND DATETIME('now')",
    "1m": "SELECT * FROM wetterdaten WHERE DATE(entry_date) BETWEEN DATE('now', '-1 month') AND DATETIME('now')",
    "1y": "SELECT * FROM wetterdaten WHERE DATETIME(entry_date) BETWEEN DATE('now', '-1 year') AND DATETIME('now')",
}

def get_wetterdaten(cur, request):
    
    date_range = request.args.get("range")
    date = request.args.get("date")
    date_from = request.args.get("from")
    date_to = request.args.get("to")
    
    if date_range:
        sql_query = queries_date_range.get(date_range)
        if not sql_query: raise ValueError("Unkown range: "+date_range)
        wetterdata = cur.execute(sql_query).fetchall()
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
    print(wetterdata)
    return wetterdata

#function for converting
#tuple into dict
def formatResponse(arr):
    if not arr: return []
    if len(arr) == 0: return []
    newArr = []
    keys = arr[0].keys()
    for entry in arr:
        dictonary = {}
        for key in keys:
            dictonary[key] = entry[key]
        newArr.append(dictonary)
    return newArr

#connection wrapper
#connects and closes db connection for querys
def connection(func, db=None):
    if not db:
        database_path = os.getenv("FLASK_DATABASE")
    else: database_path = db
    
    def func_wrapper(*args, **kwargs):
        #create a connection to the sqlite db
        connection = sqlite3.connect(database_path)
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()
        #execute the func parameter
        query_result = func(connection, cursor, *args, **kwargs)
        #commit changes and close connection
        connection.commit()
        connection.close()
        return formatResponse(query_result)
    return func_wrapper

@connection
def test_query(conn, cur):
    return cur.execute("select * from wetterdaten").fetchall()

@connection
def queryDb(_, cur, query, values=[]):
    return cur.execute(query, values).fetchall()