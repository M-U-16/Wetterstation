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
        except Error as e:
            print(e)
    #set cursor
    def setCursor(self):
        self.cursor = self.con.cursor()
    
    def queryDatabase(self, query):
        self.setConnection()
        self.setCursor()
        return self.cursor.execute(query)
        self.con.close()

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
        
        """ insert_values = (day, time, lux, humi, temp)
        data_placeholders = ()
        for value in insert_values:
            data_placeholders += ("?")
        print(data_placeholders) """
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
    
    def getDay():
        #set connection
        self.setConnection()
        self.setCursor()
        #year month day
        #qeury = SELECT * FROM wetterdaten WHERE year=? and month=? and day=?, (year, month, day)
        
        #close connection
        self.con.close()
        
    def getYear():
        #set connection
        self.setConnection()
        self.setCursor()
        #year month day
        #qeury = SELECT * FROM wetterdaten WHERE year=? and month=? and day=?, (year, month, day)
        
        #close connection
        self.con.close()
        