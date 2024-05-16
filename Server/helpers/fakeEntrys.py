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
    
def getEntryGas(date):
    return {
        "entry_date": date,
        "oxi": random.randint(10, 40),
        "nh3": random.randint(10, 50),
        "red": random.randint(10, 100)
    }

def EntryGenerator(amount):
    for i in range(amount, 0, -1):
        date_difference = datetime.now() - timedelta(days=i)
        date_zero_day = str(date_difference.date()) + " 00:00:00"
        yield getEntry(date_zero_day)
        
        for i in range(1, 24):
            date_day_added = datetime.strptime(date_zero_day, "%Y-%m-%d %H:%M:%S") + timedelta(hours=i)
            yield getEntry(str(date_day_added))
            
def GenerateEveryX(
    daysback,
    interval=30,
    date=str(datetime.now().date())+" 00:00:00"
):
    end_date = datetime.strptime(date, "%Y-%m-%d %H:%M:%S")
    start_date = end_date - timedelta(days=daysback)

    while start_date <= end_date:
        start_date += timedelta(seconds=interval)
        yield getEntry(str(start_date))
        
def GenerateEveryXGas(
    daysback,
    interval=30,
    date=str(datetime.now().date()) + " 00:00:00"
):
    end_date = datetime.strptime(date, "%Y-%m-%d %H:%M:%S")
    start_date = end_date - timedelta(days=daysback)

    while start_date <= end_date:
        start_date += timedelta(seconds=interval)
        yield getEntryGas(str(start_date))

#returns a 2 dimensional array with many entrys
def getManyRandomDataEntrys(amount):
    entrys_general = [ i for i in GenerateEveryX(amount)]
    entrys_gas = [i for i in GenerateEveryXGas(amount)]
    
    return entrys_general, entrys_gas