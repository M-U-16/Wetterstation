import os
from pathlib import Path
from os.path import join
from . import connection
from helpers.fakeEntrys import getManyRandomDataEntrys

@connection
def create_tables(con, cur):
    schemas = join(Path(__file__).parent.absolute(), "schemas")
    files = [f for f in os.listdir(schemas)]
    file_paths = list(map(lambda f: join(schemas, f), files))
    for path in file_paths:
        file = open(path, "r")
        cur.execute(file.read())
        file.close()

def genrateSql(sql_format, keys, values):
    columns_string = ""
    values_string = ""
    length = len(keys)
    for idx, i in enumerate(keys): 
        columns_string += i + ("," if idx+1 != length else "")
        values_string += "?," if idx+1 != length else "?"
    return sql_format.format(columns_string, values_string)

@connection
def random_populate_db(conn, cur, amount):
    data = getManyRandomDataEntrys(amount)
    sql = genrateSql(
        "insert into wetterdaten({}) values ({})",
        data[0].keys(),
        data[0].values()
    )
    data_tuples = [tuple(entry.values()) for entry in data]
    chunk_size = 50
    for i in range(0, len(data), chunk_size):
        cur.executemany(sql, data_tuples[i:i+chunk_size])
