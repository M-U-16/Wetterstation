import sqlite3
    
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
    
    def queryDatabase(self, query):
        self.setConnection()
        self.setCursor()
        return self.cursor.execute(query)

    def addData(self, table_name, data):
        date = data["time"]
        temp = data["temp"]
        humi = data["humi"]
        pres = data["pres"]
        lux = data["lux"]
        
        #create variables for data dates
        date_list = date.split(" ")
        year = int(date_list[4])
        month = date_list[1]
        day = int(date_list[2])
        time = date_list[3]
        
        self.setConnection()
        self.setCursor()
        self.cursor.execute(
            "INSERT INTO wetterdaten(full_date, entry_year, entry_day, entry_month, entry_time, temp, humi, pres, lux) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (date, year, day, month, time, temp, humi, pres, lux)
        )
        self.con.commit()
        self.con.close()
        
    def printTable(self, table_name):
        self.setConnection()
        self.setCursor()
        table = self.cursor.execute(f"SELECT * FROM {table_name}").fetchall()
        print(table)
        self.con.close()
        return table
    
    def getDay(self, year, month, day_text):
        #set connection
        self.setConnection()
        self.setCursor()
        #year month day
        #qeury = SELECT * FROM wetterdaten WHERE year=? and month=? and day_text=?, (year, month, day_text)
        table_content = self.cursor.execute("SELECT * FROM wetterdaten WHERE year=? and month=? and day_text=?", (year, month, day_text))
          
        #close connection
        self.con.close()
        return table_content
    
    def getWeek(self, day, month):
        #set connection
        self.setConnection()
        self.setCursor()
        #year month day
        #qeury = SELECT * FROM wetterdaten WHERE year=? and month=?, (year, month)
        table_content = self.cursor.execute("SELECT * FROM wetterdaten WHERE year=? and month=?", (day, month))
          
        #close connection
        self.con.close()
        return table_content
    
    def getMonth(self, year, month):
        #set connection
        self.setConnection()
        self.setCursor()
        #year month
        #qeury = SELECT * FROM wetterdaten WHERE year=? and month=?, (year, month)
        table_content = self.cursor.execute("SELECT * FROM wetterdaten WHERE year=? and month=?", (year, month))
        #close connection
        self.con.close()
        return table_content
    
    def getYear(self, year):
        #set connection
        self.setConnection()
        self.setCursor()
        #year month day
        table_content = self.cursor.execute("SELECT * FROM wetterdaten WHERE year=?", (year))
        #close connection
        self.con.close()
        return table_content