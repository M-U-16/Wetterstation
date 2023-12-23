""" 
FUNCTION FOR CREATING TABLES AND
POPULATING THE DATABASE WITH RANDOM DATA
"""

from models.model import Wetterdaten, db
from fakeEntrys import getManyRandomDataEntrys

def create_tables():
    print("Creating Tables!")
    db.create_tables([Wetterdaten])

def random_populate_db():
    chunk_size = 50
    data = getManyRandomDataEntrys(100)
    with db.atomic():
        for i in range(0, len(data), chunk_size):
            Wetterdaten.insert_many(
                data[i:i+chunk_size]
            ).execute()