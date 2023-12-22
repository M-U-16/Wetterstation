""" 
    FUNCTIONS FOR GETTING A LOT OF RANDOM FAKE DATA FOR
    DATABASE AND WEBPAGE TESTING
    -----------------------------------------------
"""
from datetime import datetime, timedelta
import random
#just returns new object with random values
def getEntry(date):
    return {
        "entry_date": date,
        "temp": random.randint(20, 50),
        "humi": random.randint(1, 100),
        "pres": 1000,
        "lux": random.randint(1000, 20000),
        "noise": random.choice(["HIGH", "LOW", "MID"]),
        "oxi": random.randint(1, 10),
        "red": random.randint(1, 10),
        "nh3": random.randint(1, 10),
        "pm10": random.randint(1, 10),
        "pm25": random.randint(1, 10),
        "pm100": random.randint(1, 10)
    }
#generates entrys for one year with date
def EntryGenerator(amount):
    for i in range(0, amount):
        date = str(datetime.now() - timedelta(days=i)).split(" ")[0]
        yield getEntry(date)
#returns a 2 dimensional array with many entrys
def getManyRandomDataEntrys(amount):
    entrys = [ i for i in EntryGenerator(amount)]
    return entrys
    