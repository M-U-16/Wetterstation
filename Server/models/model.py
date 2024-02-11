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

def random_populate_db(amount):
    chunk_size = 50
    