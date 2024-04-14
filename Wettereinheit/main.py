TESTING = True

# standard libraries
import random
import configparser
import sys, time, threading
from datetime import datetime
from configparser import ExtendedInterpolation
# external libraries
import requests

    # libraries for sensors
try:
    from ltr559 import LTR559
    from bme280 import BME280
    from enviroplus import gas
    from pms5003 import PMS5003, ReadTimeoutError as pmsReadTimeoutError
except Exception as e: print(">> ERROR: ", e)

# internal libraries
from socketClient import get_client
from sensors.cpu import get_cpu_temperature

config = configparser.ConfigParser(interpolation=ExtendedInterpolation())
config.optionxform=str
config.read("../pi.ini")

try:
    # LIGHT SENSOR
    ltr559 = LTR559()
    # BME280 temperature/pressure/humidity sensor
    bme280 = BME280()
    # PMS5003 particulate sensor
    pms5003 = PMS5003()
except Exception as e: print(">> ERROR: ", e)

# websocket client to send live data
server_client = get_client()

def send_json(data, url):
    try: return requests.post(url,json=data).json()
    except Exception as e:
        print(">> ERROR: ", e)
        return {"error": True, "message":"ERROR_SENDING_REQUEST"} 

def start_gas_measuring():
    def start_up_gas_sensor():
        if TESTING: START_UP_TIME = 10
        else: START_UP_TIME = 600
        
        start_time = time.time()
        running = True
        while running:
            #gas.read_all()
            time.sleep(0.5)
            
            if time.time() > start_time + START_UP_TIME:
                running = False
        print(">> gas startup finished")
                
    def read_gases():
        while True:
            if TESTING:
                gases = {"oxidising": 10000, "reducing": 10000, "nh3": 10000}
                server_client.send_gas(
                    data={
                        "entry_date": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                        "oxi": gases["oxidising"] / 1000,  #unit = "kO"
                        "red": gases["reducing"] / 1000,   #unit = "kO"
                        "nh3": gases["nh3"] / 1000         #unit = "kO"
                    }
                )
                time.sleep(30)
                continue
            else:
                gases = gas.read_all()
                server_client.send_gas(
                    data={
                        "entry_date": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                        "oxi": gases["oxidising"] / 1000,  #unit = "kO"
                        "red": gases["reducing"] / 1000,   #unit = "kO"
                        "nh3": gases["nh3"] / 1000         #unit = "kO"
                    }
                )

                time.sleep(30)

    start_up_gas_sensor()
    read_gases()

def start_data_measuring():
    pm1 = None
    pm10 = None
    pm25 = None
    
    while True:
        if TESTING:
            server_client.send_readings(
                data={
                    "entry_date": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    "temp": random.randrange(0,34),
                    "humi": random.randrange(0,100),
                    "pres": random.randrange(1, 1000),
                    "lux": random.randrange(1, 100),
                    "pm10": random.randrange(10, 20),
                    "pm25": random.randrange(21, 25),
                    "pm100": random.randrange(100, 1000),
                }
            )
            time.sleep(5)
            continue
        
        try: pm = pms5003.read()
        except pmsReadTimeoutError: pass
        else:
            pm1 = float(pm.pm_ug_per_m3(1.0)) #unit = "ug/m3"
            pm10 = float(pm.pm_ug_per_m3(10)) #unit = "ug/m3"
            pm25 = float(pm.pm_ug_per_m3(2.5)) #unit = "ug/m3"
            
        server_client.send_readings(
            data={
                "entry_date": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                "temp": bme280.get_temperature(),
                "proxi": ltr559.get_proximity(),
                "humi": bme280.get_humidity(), #unit = "%"
                "pres": bme280.get_pressure(), #unit = "hPa"
                "lux": ltr559.get_lux(), # unit = lux
                "pm10": pm1,
                "pm25": pm25,
                "pm100": pm10,
            }
        )
            
        
def _main():
    gas_thread = threading.Thread(target=start_gas_measuring, daemon=True)
    data_thread = threading.Thread(target=start_data_measuring, daemon=True)
    
    try:
        # connecting to server
        server_client.io.connect(
            "http://localhost:8080",
            namespaces="/pi",
            auth={"key": "1234"}
        )
        
        # start threads
        gas_thread.start()
        data_thread.start()
        
        # infinite loop for staying connected to server
        # via websocket connection
        while True: time.sleep(0.01)
            
    except KeyboardInterrupt:
        #server_client.io.disconnect() # disconnecting from server
        sys.exit(">> PROGRAMM STOPPED") # programm exit
    except Exception as e: sys.exit(">> ERROR: {}".format(e))

if __name__ == "__main__": _main()