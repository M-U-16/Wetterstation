import os
import sys
import sqlite3

DB_PATH = os.getenv("DATABASE_PATH")
if not DB_PATH: sys.exit(
    """
    Path to database is not defined
    --> models/__init__.py <--
    """
)

#function for converting
#tuple into dict
def formatResponse(arr):
    if not arr: return []
    if len(arr) == 0: return []
    newArr = []
    keys = arr[0].keys()
    for entry in arr:
        dictonary = {}
        for key in keys:
            dictonary[key] = entry[key]
        newArr.append(dictonary)
    return newArr

#connection wrapper
#connects and closes db connection for querys
def connection(func):
    def func_wrapper(*args, **kwargs):
        #create a connection to the sqlite db
        connection = sqlite3.connect(DB_PATH)
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()
        #execute the func parameter
        query_result = func(connection, cursor, *args, **kwargs)
        #commit changes and close connection
        connection.commit()
        connection.close()
        return formatResponse(query_result)
    return func_wrapper

@connection
def test_query(conn, cur):
    return cur.execute("select * from wetterdaten").fetchall()

@connection
def queryDb(con, cur, query, values=[]):
    return cur.execute(query, values).fetchall()