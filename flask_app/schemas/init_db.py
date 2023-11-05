import sqlite3
import os

path = os.getcwd().split("\\")
path.pop()
path = "/".join(path)

if not os.path.exists(path + "/wetter.db"):
    sqlite3.connect(path + "/wetter.db")

#Database Path = ../wetter.db
def create_wetterdaten_table(path):
    con = sqlite3.connect(path)
    with open("schema.sql", "r") as f:
        con.executescript(f.read())

create_wetterdaten_table(path + "/wetter.db")