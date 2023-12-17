import peewee as pw
from __main__ import app
from datetime import datetime
from playhouse.flask_utils import FlaskDB
from playhouse.sqlite_ext import SqliteExtDatabase
from peewee import (
    PrimaryKeyField,
    IntegerField,
    TextField,
    DateTimeField
)
peewee_db = SqliteExtDatabase(
    "../data/wetter.sqlite3",
    pragmas={"journal_mode": "wal"}
)
db_wrapper = FlaskDB(app, peewee_db)
class BaseModel(db_wrapper.Model):
    class Meta:
        database = db_wrapper

class Wetterdaten(BaseModel):
    table_name = "wetterdaten"
    entry_id = PrimaryKeyField()
    entry_date = DateTimeField(default=datetime.now())
    #entry_time = DateTimeField(default=datetime.date.today)
    temperature = IntegerField()
    humidity = IntegerField()
    pressure = IntegerField(null=True)
    lux_level = IntegerField(null=True)
    oxi = TextField(null=True)
    red = TextField(null=True)
    nh3 = TextField(null=True)
    pm10 = TextField(null=True)
    pm25 = TextField(null=True)
    pm100 = TextField(null=True)

def populateDb():
    res = None
    entry_data = {
        "temperature": 20,
        "humidity": 20
    }
    try:
        res = (
            Wetterdaten
                .insert(**entry_data)
                .execute()
        )
        print(res)
    except Exception as e:
        print(e)

if __name__ == "__main__":
    Wetterdaten.create_table(safe=True)
    #populateDb()