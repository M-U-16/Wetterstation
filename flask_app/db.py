import sqlite3
from flask import g

def get_connection():
    if "db" not in g:
        conn = sqlite3.connect("wetter.db")
        conn.row_factory = sqlite3.Row
        g.db = conn
    return g.db

def query_db(query):
    pass