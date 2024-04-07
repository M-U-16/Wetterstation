import os
import sqlite3
from flask import g
from pathlib import Path
from os.path import join
from helpers.fakeEntrys import getManyRandomDataEntrys

def get_db():
    db = getattr(g, "_database", None)
    if db is None:
        db = g._database = sqlite3.connect(os.getenv("DATABASE_PATH"))
    return db

def getConnection():
    database_path = os.getenv("DATABASE_PATH")
    
    #create a connection to the sqlite db
    connection = sqlite3.connect(database_path)
    connection.row_factory = sqlite3.Row
    return connection
    
def create_tables():
    con = getConnection()
    
    schemas = join(Path(__file__).parent.absolute(), "schemas")
    files = [f for f in os.listdir(schemas)]
    file_paths = list(map(lambda f: join(schemas, f), files))
    for path in file_paths:
        file = open(path, "r")
        con.executescript(file.read())
        file.close()
        
    con.commit()
    con.close()

def random_populate_db(amount):
    con = getConnection()
    
    data = getManyRandomDataEntrys(amount)
    sql = genrateSql(
        "insert into wetterdaten({}) values ({})",
        data[0].keys()
    )
    data_tuples = [tuple(entry.values()) for entry in data]
    chunk_size = 50
    for i in range(0, len(data), chunk_size):
        con.executemany(sql, data_tuples[i:i+chunk_size])
    
    con.commit()
    con.close()

def genrateSql(sql_format, keys):
    columns_string = ""
    values_string = ""
    length = len(keys)
    for idx, i in enumerate(keys):
        columns_string += i + ("," if idx+1 != length else "")
        values_string += "?," if idx+1 != length else "?"
    return sql_format.format(columns_string, values_string)

