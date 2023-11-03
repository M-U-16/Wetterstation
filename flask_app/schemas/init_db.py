import sqlite3

#Database Path = ../wetter.db
def create_wetterdaten_table(path):
    con = sqlite3.connect(path)
    with open("schema.sql", "r") as f:
        con.executescript(f.read())

create_wetterdaten_table("../wetter.db")