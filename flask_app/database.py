import sqlite3
from datetime import datetime

class Database:
    def __init__(self):
        self.con = 0
        self.path = ""
        self.cursor = None
    
    def __init__(self, path):
        self.setPath(path)
        self.setConnection()
        self.setCursor()
    
    #set path for database
    def setPath(self, path):
        self.path = path
    #set connection
    def setConnection(self):
        try:
            self.con = sqlite3.connect(self.path)
        except:
            print("Ein fehler is beim Verbinden mit der Datebank aufgetreten!")
    #set cursor
    def setCursor(self):
        self.cursor = self.con.cursor()
    
    def queryDb(self, query, args=[]):
        
        result = self.cursor.execute(query, args)
        self.con.commit()
        return result

    def addData(self, data):
        #date = data["time"]
        temp = data["temp"]
        humi = data["humi"]
        pres = data["pres"]
        lux = data["lux"]
        
        self.queryDb(
            "INSERT INTO wetterdaten(entry_date, entry_time, temp, humi, pres, lux) VALUES (?, ?, ?, ?, ?, ?)",
            (data["date"], data["time"], temp, humi, pres, lux)
        )
        
        
    def printTable(self, table_name):
        self.setConnection()
        self.setCursor()
        table = self.cursor.execute(f"SELECT * FROM {table_name}").fetchall()
        self.con.close()
        return table
    
    def getDay(self):
        currentDate = datetime.today().strftime('%Y-%m-%d')
        
        res = self.queryDb(
            "select * from wetterdaten where entry_date=?",
            [currentDate]
        ).fetchall()
        print(res)
        return res
    def getWeek(self, day, month):
        pass
    
    def getMonth(self, year, month):
        pass
    
    def getYear(self, year):
        pass
    
