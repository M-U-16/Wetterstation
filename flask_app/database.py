import sqlite3
from datetime import datetime

class Database:
    def __init__(self):
        self.con = 0
        self.path = ""
        self.cursor = None
    
    def __init__(self, path):
        self.setPath(path)
    
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
    
    def queryDb(self, query, args):
        self.setConnection()
        self.setCursor()
        
        result = self.cursor.execute(query, args)
        self.con.commit()
        self.con.close()
        return result

    def addData(self, data):
        #date = data["time"]
        temp = data["temp"]
        humi = data["humi"]
        pres = data["pres"]
        lux = data["lux"]
        
        date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        day_text = "SUN"
        
        self.queryDb(
            "INSERT INTO wetterdaten(entry_date, entry_day_text, temp, humi, pres, lux) VALUES (?, ?, ?, ?, ?, ?)",
            (date, day_text, temp, humi, pres, lux)
        )
        
        
    def printTable(self, table_name):
        self.setConnection()
        self.setCursor()
        table = self.cursor.execute(f"SELECT * FROM {table_name}").fetchall()
        print(table)
        self.con.close()
        return table
    
    def getDay(self):
        return datetime.today().strftime('%Y-%m-%d')
    def getWeek(self, day, month):
        pass
    
    def getMonth(self, year, month):
        pass
    
    def getYear(self, year):
        pass
    
