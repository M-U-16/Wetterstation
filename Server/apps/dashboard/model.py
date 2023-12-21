from datetime import datetime
import peewee as pw
from sys import exit
from peewee import (
    PrimaryKeyField,
    IntegerField,
    TextField,
    DateTimeField
)
from __main__ import app
exit(0)
print(app.config[""])
peewee_db = pw.SqliteDatabase(app.config["DATABASE_PATH"])


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