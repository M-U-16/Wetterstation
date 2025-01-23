import sqlite3
import time

conn = sqlite3.connect("test.sqlite3")
conn.execute("CREATE TABLE IF NOT EXISTS test_tb(date1 DATETIME, date2 DATETIME)")
conn.execute("INSERT INTO test_tb(date1, date2) VALUES (datetime('now'), datetime('now', 'localtime'))")
conn.commit()
conn.close()