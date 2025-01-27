import os
from flask import g
from .model import getConnection

def get_meta_db():
    db = getattr(g, "_meta_db", None)
    if db is None:
        db = g._meta_db = getConnection(os.getenv("FLASK_META_DATABASE"))
    return db

def close_meta_db(exception):
    db = getattr(g, "_meta_db", None)
    if db is not None:
        print("closing meta db")
        db.close()