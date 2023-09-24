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