import sqlite3
    
def setUp(path):
    con = sqlite3.connect(path)
    cursor = con.cursor()
    cursor.execute("CREATE TABLE wetterdaten (entry_id INTEGER PRIMARY KEY, date TEXT, temp INT, humi INT, pres INT, lux INT)")
    con.close()
    print("Database and table created!")
    

    