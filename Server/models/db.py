from operator import length_hint
import os
import sqlite3
from dotenv import load_dotenv
#loading .env variables
load_dotenv()
DB_PATH = os.getenv("DATABASE_PATH")

querys = {
    "add-data": "INSERT INTO wetterdaten(entry_date, entry_time, temp, humi, pres, lux) VALUES (?, ?, ?, ?, ?, ?)",
    "current-day": "select * from wetterdaten where entry_date=Date('now')",
    "time-range": "select * from wetterdaten where entry_date between ? and ?",
    "get-week": "select * from wetterdaten where entry_date between DATE('now', '-7 days') and DATE('now')",
    "get-month":  "select * from wetterdaten where entry_date between DATE('now', '-1 month') and DATE('now')",
    "get-year": "select * from wetterdaten where entry_date between DATE('now', '-1 year') and DATE('now')",
}

columns = ["entry_id", "entry_date", "temp","humi", "pres","lux","noise", "oxi","red", "nh3","pm10", "pm25","pm100"]
def formatResponse(arr):
    newArr = []
    if len(arr) == 0: return []
    keys = arr[0].keys()
    for entry in arr:
        dictonary = {}
        for key in keys:
            dictonary[key] = entry[key]
        newArr.append(dictonary)
    return newArr

#connection decorator
def connection(func):
    def func_wrapper(*args, **kwargs):
        connection = sqlite3.connect(DB_PATH)
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()
        query_result = func(connection, cursor, *args, **kwargs)
        connection.commit()
        connection.close()
        return query_result
    return func_wrapper

@connection
def test_query(conn, cur):
    cur.execute("select * from wetterdaten")
    rows = cur.fetchall()
    return rows

@connection
def queryDb(con, cur, query, values=[]):
    result = cur.execute(query, values).fetchall()
    return result

def addData(data):
    data_tuple = (
        data["date"],
        data["time"],
        data["temp"],
        data["humi"],
        data["pres"],
        data["lux"]
    )
    queryDb(querys["add-data"], data_tuple)
    
def getDay():
    result = queryDb(querys["current-day"])
    return formatResponse(result)

def getTimeRange(firstDate, lastDate):
    result = queryDb(querys["time-range"], [firstDate, lastDate])
    return formatResponse(result)

def getWeek():
    result = queryDb(querys["get-week"])
    return formatResponse(result)

def getMonth():
    result = queryDb(querys["get-month"])
    return formatResponse(result)

def getYear():
    result = queryDb(querys["get-year"])
    return formatResponse(result)

def printAll():
    print(queryDb("select * from wetterdaten"))
    