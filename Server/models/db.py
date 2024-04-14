from models import queryDb

querys = {
    "add-data": "INSERT INTO wetterdaten(entry_date, temp, humi, pres, lux) VALUES (?, ?, ?, ?, ?)",
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
    data_list = list(data.values())
    queryDb(querys["add-data"], data_list)
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


    