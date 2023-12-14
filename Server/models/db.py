import json
import sqlite3
from datetime import datetime

querys = {
    "add-data": "INSERT INTO wetterdaten(entry_date, entry_time, temp, humi, pres, lux) VALUES (?, ?, ?, ?, ?, ?)",
    "current-day": "select * from wetterdaten where entry_date=Date('now')",
    "time-range": "select * from wetterdaten where entry_date between ? and ?",
    "get-week": "select * from wetterdaten where entry_date between DATE('now', '-7 days') and DATE('now')",
    "get-month":  "select * from wetterdaten where entry_date between DATE('now', '-1 month') and DATE('now')",
    "get-year": "select * from wetterdaten where entry_date between DATE('now', '-1 year') and DATE('now')",
}
columns = ["entry_id", "entry_date","entry_time", "temp","humi", "pres","lux", "high","mid", "low","amp", "oxi","red", "nh3","pm10", "pm25","pm100"]

def formatResponse(arr):
    newArr = []
    for entry in arr:
        dictonary = {}
        for index, value in enumerate(columns):
            dictonary[value] = entry[index]
        newArr.append(dictonary)
    return newArr

def get_connection(): return sqlite3.connect("./mess-daten/wetter.db")

def queryDb(query, args=[]):
    conn = get_connection()
    cursor = conn.cursor()
    result = cursor.execute(query, args)
    conn.commit()
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
    queryDb( querys["add-data"], data_tuple)
    
def getDay():
    #currentDate = datetime.today().strftime('%Y-%m-%d')
    res = queryDb(querys["current-day"]).fetchall()
    return formatResponse(res)

def getTimeRange(firstDate, lastDate):
    res = queryDb(querys["time-range"], [firstDate, lastDate]).fetchall()
    return formatResponse(res)

def getWeek():
    res = queryDb(querys["get-week"]).fetchall()
    return formatResponse(res)

def getMonth():
    res = queryDb(querys["get-month"]).fetchall()
    return formatResponse(res)

def getYear():
    res = queryDb(querys["get-year"]).fetchall()
    return formatResponse(res)