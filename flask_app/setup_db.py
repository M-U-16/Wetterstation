import sqlite3
    
def setUp(path):
    con = sqlite3.connect(path)
    cursor = con.cursor()
    cursor.execute("CREATE TABLE wetterdaten (entry_id INTEGER PRIMARY KEY, full_date TEXT, entry_year INT, entry_day INT, entry_month TEXT, entry_time TEXT, temp INT, humi INT, pres INT, lux INT)")
    con.close()
    print("Database and table created!")

def resetTable(path):
    con = sqlite3.connect(path)
    cursor = con.cursor()
    cursor.execute("DROP TABLE wetterdaten")
    cursor.execute("CREATE TABLE wetterdaten (entry_id INTEGER PRIMARY KEY, full_date TEXT, entry_year INT, entry_day INT, entry_month TEXT, entry_time TEXT, temp INT, humi INT, pres INT, lux INT)")
    con.close()