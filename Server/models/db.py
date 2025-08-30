from models import queryDb
from models.model import generateSql

querys = {
    "add-data": "INSERT INTO wetterdaten(date, temp, humi, pres, lux, pm10, pm25, pm100) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    "current-day": "select * from wetterdaten where date=Date('now')",
    "time-range": "select * from wetterdaten where date between ? and ?",
    "get-week": "select * from wetterdaten where date between DATE('now', '-7 days') and DATE('now')",
    "get-month":  "select * from wetterdaten where date between DATE('now', '-1 month') and DATE('now')",
    "get-year": "select * from wetterdaten where date between DATE('now', '-1 year') and DATE('now')",
    "last-entry": "select * from wetterdaten order by entry_id desc limit 1",
    "last-by-amount": "select * from wetterdaten desc limit ?",
    "last-5-with-value": "select * from wetterdaten where entry_id < ? order by entry_id desc limit 5", 
    "last-5": "select * from wetterdaten order by entry_id desc limit 5"
}

querys_gases = {
    "add-data": "INSERT INTO gas(date, oxi, red, nh3) VALUES (?, ?, ?, ?)"
}

def addEntry(data:dict):
    query = generateSql("INSERT INTO wetterdaten({}) VALUES ({})", data.keys())
    queryDb(query, list(data.values()))
def getTimeRange(firstDate:str, lastDate:str):
    return queryDb(querys["time-range"], [firstDate, lastDate])
def getLastByAmount(amount:int):
    return queryDb(querys["last-by-amount"], [amount])
    
def getDay(): return queryDb(querys["current-day"])
def getWeek(): return queryDb(querys["get-week"])
def getMonth(): return queryDb(querys["get-month"])
def getYear(year=None):
    if year:
        return queryDb("SELECT * FROM wetterdaten WHERE STRFTIME('%Y', date)=?", year)
    return queryDb(querys["get-year"])
def getLastEntry(): return queryDb(querys["last-entry"])
def getDate(date:str): return queryDb("SELECT * FROM wetterdaten WHERE STRFTIME('%Y-%m-%d', date)=?", [date])
def printAll(): print(queryDb("select * from wetterdaten"))

def getAvgFromDay(date:str):
    return queryDb(
        "SELECT date, round(avg(temp), 2) as avg_temp, round(avg(humi), 2) as avg_humi FROM wetterdaten " \
        "where date between strftime('%Y-%m-%d 00:00:00', ?) and strftime('%Y-%m-%d 00:00:00', ? ,'+1 day') " \
        "group by strftime('%Y-%m-%d %H', date)",
        [date, date]
    )
    
def getAvgDataFromToday():
    return queryDb(
        "SELECT date, round(avg(temp), 2) as avg_temp, round(avg(humi), 2) as avg_humi FROM wetterdaten " \
        "where date between strftime('%Y-%m-%d 00:00:00', 'now') and strftime('%Y-%m-%d 00:00:00', 'now', '+1 day') " \
        "group by strftime('%Y-%m-%d %H', date)"
    )

def getLastEntrys(last:int=None):
    get_last = lambda dict_list: min(dict_list, key=lambda x: x["entry_id"])["entry_id"]
    if last:
        result = queryDb(querys["last-5-with-value"], [last])
        current_last = get_last(result)
        return result, current_last
    
    result = queryDb(querys["last-5"])
    return result, get_last(result)

def searchEntrys(date:str, limit:int):
    return queryDb(
        "select * from wetterdaten where date like ? order by entry_id desc limit ?",
        ["%{}%".format(date), limit]
    )

def addGases(data:dict):
    return queryDb(
        querys_gases["add-data"],
        [
            data["date"],
            data["oxi"],
            data["red"],
            data["nh3"]
        ]
    )
    
def getAvgGas(start_date:str, end_date:str):
    return queryDb(
        "select round(avg(red), 2) as avg_red, round(avg(oxi), 2) as avg_oxi, round(avg(nh3), 2) as avg_nh3 from gas where date between ? and ?",
        [start_date, end_date]
    )
    
def getAvgGasLastMinute(date:str):
    return queryDb(
        "select round(avg(red), 2) as avg_red, round(avg(oxi), 2) as avg_oxi, round(avg(nh3), 2) as avg_nh3 from gas where date between Date(?, '-1 minute') and ?",
        [date, date]
    )
    
def getAvgGasLastMinuteToday():
    return queryDb("select round(avg(red), 2) as avg_red, round(avg(oxi), 2) as avg_oxi, round(avg(nh3), 2) as avg_nh3 from gas where date between Date('now', '-1 minute') and Date('now')")