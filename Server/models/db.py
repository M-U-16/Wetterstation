from models import queryDb

querys = {
    "add-data": "INSERT INTO wetterdaten(entry_date, entry_time, temp, humi, pres, lux) VALUES (?, ?, ?, ?, ?, ?)",
    "current-day": "select * from wetterdaten where entry_date=Date('now')",
    "time-range": "select * from wetterdaten where entry_date between ? and ?",
    "get-week": "select * from wetterdaten where entry_date between DATE('now', '-7 days') and DATE('now')",
    "get-month":  "select * from wetterdaten where entry_date between DATE('now', '-1 month') and DATE('now')",
    "get-year": "select * from wetterdaten where entry_date between DATE('now', '-1 year') and DATE('now')",
}

def addData(data):
    data_list = list(data.values())
    print(data_list)
    queryDb(querys["add-data"], data_list)
    
def getTimeRange(firstDate, lastDate):
    return queryDb(querys["time-range"], [firstDate, lastDate])
def getDay(): return queryDb(querys["current-day"])
def getWeek(): return queryDb(querys["get-week"])
def getMonth(): return queryDb(querys["get-month"])
def getYear(): return queryDb(querys["get-year"])
def printAll(): print(queryDb("select * from wetterdaten"))
    