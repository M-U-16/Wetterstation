import sqlite3
def setUpTable():
    con = sqlite3.connect("wetter.db")
    cursor = con.cursor()
    """ cursor.execute("DROP TABLE wetterdaten") """
    cursor.execute("CREATE TABLE wetterdaten (id INT AUTOINCREMENT ,time TEXT, temp INT, humi INT, pres INT, lux INT)")

def addData(data):
    #create variables for data
    date = data["time"]
    temp = data["temp"]
    humi = data["humi"]
    pres = data["pres"]
    lux = data["lux"]
    print(date, temp, humi, pres, lux)
    
    con = sqlite3.connect("wetter.db")
    cursor = con.cursor()
    cursor.execute("INSERT INTO wetterdaten VALUES (?, ?, ?, ?, ?)", (date, temp, humi, pres, lux))
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
    def setConnection(self)
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
        
        