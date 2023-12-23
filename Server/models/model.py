import os
import dotenv
import peewee as pw
from datetime import datetime
from helpers.fakeEntrys import getManyRandomDataEntrys
from peewee import (
    PrimaryKeyField,
    IntegerField,
    TextField,
    DateField
)

dotenv.load_dotenv()
db = pw.SqliteDatabase(os.getenv("DATABASE_PATH"))

class BaseModel(pw.Model):
    class Meta:
        database = db

class Wetterdaten(BaseModel):
    table_name = "wetterdaten"
    entry_id = PrimaryKeyField()
    entry_date = DateField()
    #entry_time = TimeField(default=datetime.now().strftime("%H:%M:%S"))
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
    print("Creating Tables!")
    db.create_tables([Wetterdaten])
    print("Created Tables")

def random_populate_db():
    chunk_size = 50
    data = getManyRandomDataEntrys(100)
    with db.atomic():
        for i in range(0, len(data), chunk_size):
            Wetterdaten.insert_many(
                data[i:i+chunk_size]
            ).execute()