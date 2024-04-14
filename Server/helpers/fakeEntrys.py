""" 
    FUNCTIONS FOR GETTING A LOT OF RANDOM FAKE DATA FOR
    DATABASE AND WEBPAGE TESTING
    -----------------------------------------------
"""
import random
from datetime import datetime, timedelta

#just returns new object with random sensor values
def getEntry(date):
    return {
        "entry_date": date,
        "temp": random.randint(-5, 30),
        "humi": random.randint(1, 100),
        "pres": 1000,
        "lux": random.randint(1000, 20000),
        "noise": random.choice(["HIGH", "LOW", "MID"]),
        "pm10": random.randint(1, 10),
        "pm25": random.randint(1, 10),
        "pm100": random.randint(1, 10)
    }

#generates entrys for one year with date
def EntryGenerator(amount):
    for i in range(amount, 0, -1):
        date = str(datetime.now() - timedelta(days=i)).split(".")[0]
        yield getEntry(date)

#returns a 2 dimensional array with many entrys
def getManyRandomDataEntrys(amount):
    entrys = [ i for i in EntryGenerator(amount)]
    
    for i in range(0, 10):
        date = str(datetime.now() + timedelta(seconds=i*5)).split(".")[0]
        entrys.append(getEntry(date=date))
    
    return entrys
    