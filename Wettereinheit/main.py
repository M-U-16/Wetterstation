import time
import threading
from ltr559 import LTR559
from bme280 import BME280
from enviroplus import gas
from pms5003 import PMS5003, ReadTimeoutError as pmsReadTimeoutError

from sensors.cpu import get_cpu_temperature

# LIGHT SENSOR
ltr559 = LTR559()

# BME280 temperature/pressure/humidity sensor
bme280 = BME280()

# PMS5003 particulate sensor
pms5003 = PMS5003()

# Tuning factor for compensation. Decrease this number to adjust the
# temperature down, and increase to adjust up
factor = 2.25

class Config: pass    

def start_gas_measuring():
    def start_up_gas_sensor():
        START_UP_TIME = 10_000
        running = True
        start_time = time.time()
        
        while running:
            gas.read_all()
            time.sleep(0.5)
            
            if time.time() > start_time + START_UP_TIME:
                running = False      
            
    def read_gases():
        while True:
            gases = gas.read_all()
        
            oxidised = gases.oxidising / 1000 #unit = "kO"
            reduced = gases.reducing / 1000 #unit = "kO"
            nh3 = gases.nh3 / 1000 #unit = "kO"
            
            time.sleep(30)
            
            #send to server
    
    start_up_gas_sensor()
    read_gases()
    

def readData():
    
    proximity = ltr559.get_proximity()
    
    raw_temp = bme280.get_temperature()
    pressure = bme280.get_pressure() #unit = "hPa"
    humidity = bme280.get_humidity() #unit = "%"
    
    light = ltr559.get_lux() # unit = lux
    
    try: pm = pms5003.read()
    except pmsReadTimeoutError: pass
    else:
        pm1 = float(pm1.pm_ug_per_m3(1.0)) #unit = "ug/m3"
        pm10 = float(pm.pm_ug_per_m3(10)) #unit = "ug/m3"
        pm25 = float(pm25.pm_ug_per_m3(2.5)) #unit = "ug/m3"
        
def _main():
    pass

if __name__ == "__main__": _main()