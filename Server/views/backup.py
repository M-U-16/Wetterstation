import os
import sqlite3
import tempfile
from flask import Blueprint, request

from models import get_db
from models.model import create_tables

blueprint = Blueprint(
    "backup_bp",
    __name__,
    url_prefix="/backup"
)

@blueprint.get("/")
def backup_route():
    # date of the last backup
    #data_db_cr.execute("SELECT * FROM ")
    #data_db.execute("")
    #print(tempfile.gettempdir())
    
    date = request.args.get("date")
    data_db, cursor = get_db()
    
    # create database that lives in
    # memory to store all data entries
    #temp_db = sqlite3.connect(":memory:")
    with tempfile.NamedTemporaryFile(suffix=".sqlite3", dir=tempfile.gettempdir()) as tmp_file:
        print(tmp_file.name)
        temp_db = sqlite3.connect(tmp_file.name)
        create_tables(temp_db, sql_file="wetter.sql")
    #temp_cr = temp_db.cursor()
    #temp_db.close()
    
    
    
    