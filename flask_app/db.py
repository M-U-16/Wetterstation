import sqlite3
def setUpTable():
    con = sqlite3.connect("wetter.db")
    cursor = con.cursor()
    cursor.execute("CREATE TABLE wetterdaten (entry_id INT AUTOINCREMENT ,date TEXT, temp INT, humi INT, pres INT, lux INT)")

def addData(data):
    #create variables for data
    #date
    date = data["time"]
    date_list = date.split(" ")
    year = int(date_list[4])
    month = date_list[1]
    day = int(date_list[2])
    time = date_list[3]
    
    #wetterdaten
    temp = data["temp"]
    humi = data["humi"]
    pres = data["pres"]
    lux = data["lux"]
    
    con = sqlite3.connect("wetter.db")
    cursor = con.cursor()
    cursor.execute(
        "INSERT INTO wetterdaten(full_date, entry_year, entry_day, entry_month, entry_time, temp, humi, pres, lux) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (date, year, day, month, time, temp, humi, pres, lux)
    )
    con.commit()

def printTable():
    con = sqlite3.connect("wetter.db")
    cursor = con.cursor()
    table = cursor.execute("SELECT * FROM wetterdaten").fetchall()
    print(table)
    
class Database:
    def __init__(self):
        self.con = 0
        self.path = ""
    
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
        except Error as e:
            print(e)
    #set cursor
    def setCursor(self):
        self.cursor = self.con.cursor()
    
    def queryDatabase(self, query):
        cursor = self.con.cursor()
        return cursor.execute(query)

    def addData(self, table_name, data):
        date = data["time"]
        temp = data["temp"]
        humi = data["humi"]
        pres = data["pres"]
        lux = data["lux"]
        self.cursor.execute("INSERT INTO ? VALUES (?, ?, ?, ?, ?)", (table_name ,date, temp, humi, pres, lux))
        self.con.commit()
        
        