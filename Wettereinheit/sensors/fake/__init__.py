import time
import random
import threading
from datetime import datetime
from sensors import ExceptionWarmUpNotDone

TEST_START_UP_TIME = 60

class GasSensorFake:
    def __init__(
        self,
        interval=None,
        start_up_time=TEST_START_UP_TIME
    ):
        self.name = "gas_sensor_fake"
        self.start_up_time = start_up_time
        self.interval = interval
    
        # setup and start a new thread
        # to warm up the sensor
        self._start_up_time = start_up_time
        self._finished_start_up = threading.Event()
        self._start_up_thread = threading.Thread(target=self._start_up)
        self._start_up_thread.start()
            
    def _start_up(self):
        start_time = time.time()
        while time.time() <= start_time + self._start_up_time:
            time.sleep(0.5) # slepp for short period
        self._finished_start_up.set()
    
    def read(self, date=False):
        if not self._finished_start_up.is_set():
            raise ExceptionWarmUpNotDone("GasSensor still in warm up mode")
        
        gases = {"oxidising": 10000, "reducing": 10000, "nh3": 10000}
        readings = {
            "oxi": gases["oxidising"] / 1000,  #unit = "kO"
            "red": gases["reducing"] / 1000,   #unit = "kO"
            "nh3": gases["nh3"] / 1000         #unit = "kO"
        }
        if date: readings["entry_date"] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return readings

class Bme280SensorFake:
    def __init__(self):
        self.name = "bme280_fake"

    # reads the current temperature, humidity and pressure
    def read(self, date=False):
        data = {
            "temp": random.randrange(0,34),
            "humi": random.randrange(0,100),
            "pres": random.randrange(1, 1000)
        }
        if date: data["date"] = datetime.now()
        return data

    def read_temp(self): return self.read(date=False)["temp"]
    def read_humi(self): return self.read(date=False)["humi"]
    def read_pres(self): return self.read(date=False)["pres"]

class ParticleSensorFake:
    def __init__(self):
        self.name = "pms5003_fake"
    
    def read(self, date=False):
        readings = {
            "pm10": random.randrange(10, 20),
            "pm25": random.randrange(21, 25),
            "pm100": random.randrange(100, 1000),
        }
        if date: readings["date"] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return readings
        
    def read_pm10(self): return self.read(date=False)["pm10"]
    def read_pm25(self): return self.read(date=False)["pm25"]
    def read_pm100(self): return self.read(date=False)["pm100"]
    
class Ltr559SensorFake:
    def __init__(self):
        self.name = "ltr_sensor_fake"
    def read(self, date=False):
        reading = {
            "lux": random.randrange(1, 100),
            "prox": random.randrange(400, 1000)
        }
        if date: reading["date"] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return reading