import peewee as pw
from helpers.getFakeEntrys import getManyRandomDataEntrys
try:
    from __main__ import app
except Exception as e:    
    print(e)
from datetime import datetime
from peewee import (
    PrimaryKeyField,
    IntegerField,
    TextField,
    DateTimeField
)
#print(app.config[""])
peewee_db = pw.SqliteDatabase(
    app.config["DATABASE_PATH"],
)

class BaseModel(pw.Model):
    class Meta:
        database = peewee_db

class Wetterdaten(BaseModel):
    table_name = "wetterdaten"
    entry_id = PrimaryKeyField()
    entry_date = DateTimeField(default=datetime.now())
    temp = IntegerField()
    humi = IntegerField()
    pres = IntegerField(null=True)
    lux = IntegerField(null=True)
    noise = TextField(null=True)
    oxi = TextField(null=True)
    red = TextField(null=True)
    nh3 = TextField(null=True)
    pm10 = TextField(null=True)
    pm25 = TextField(null=True)
    pm100 = TextField(null=True)

def create_tables():
    with peewee_db as db:
        db.create_tables([Wetterdaten])

def populateDb():
    res = None
    entry_data = getManyRandomDataEntrys()
    try:
        res = Wetterdaten.insert_many(entry_data).execute()
        print(res)
    except Exception as e:
        print(e)