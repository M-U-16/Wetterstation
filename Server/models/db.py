from models import queryDb
from models.model import generateSql

querys = {
    "add-data": "INSERT INTO wetterdaten(entry_date, temp, humi, pres, lux, pm10, pm25, pm100) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    "current-day": "select * from wetterdaten where entry_date=Date('now')",
    "time-range": "select * from wetterdaten where entry_date between ? and ?",
    "get-week": "select * from wetterdaten where entry_date between DATE('now', '-7 days') and DATE('now')",
    "get-month":  "select * from wetterdaten where entry_date between DATE('now', '-1 month') and DATE('now')",
    "get-year": "select * from wetterdaten where entry_date between DATE('now', '-1 year') and DATE('now')",
    "last-entry": "select * from wetterdaten order by entry_id desc limit 1",
    "last-by-amount": "select * from wetterdaten desc limit ?",
    "last-5-with-value": "select * from wetterdaten where entry_id < ? order by entry_id desc limit 5", 
    "last-5": "select * from wetterdaten order by entry_id desc limit 5"
}

querys_gases = {
    "add-data": "INSERT INTO gas(entry_date, oxi, red, nh3) VALUES (?, ?, ?, ?)"
}

def addEntry(data):
    query = generateSql("INSERT INTO wetterdaten({}) VALUES ({})", data.keys())
    queryDb(query, list(data.values()))
def getTimeRange(firstDate, lastDate):
    return queryDb(querys["time-range"], [firstDate, lastDate])
def getLastByAmount(amount):
    return queryDb(querys["last-by-amount"], [amount])
    
def getDay(): return queryDb(querys["current-day"])
def getWeek(): return queryDb(querys["get-week"])
def getMonth(): return queryDb(querys["get-month"])
def getYear(): return queryDb(querys["get-year"])
def getLastEntry(): return queryDb(querys["last-entry"])
def printAll(): print(queryDb("select * from wetterdaten"))

def getLastEntrys(last=None):
    get_last = lambda dict_list: min(dict_list, key=lambda x: x["entry_id"])["entry_id"]
    if last:
        result = queryDb(querys["last-5-with-value"], [last])
        current_last = get_last(result)
        return result, current_last
    
    result = queryDb(querys["last-5"])
    return result, get_last(result)

def addGases(data):
    return queryDb(
        querys_gases["add-data"],
        [
            data["entry_date"],
            data["oxi"],
            data["red"],
            data["nh3"]
        ]
    )