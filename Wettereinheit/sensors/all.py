""" gas_thread = threading.Thread(
target=start_gas_measuring,
daemon=True,
args=(client, 60, 30,) #int(config["sensors.gas"]["StartUpTime"])
) """
""" data_thread = threading.Thread(
target=start_data_measuring,
daemon=True,
args=(client, 10,)
) """
    
    
import sys
import time
from datetime import datetime
try:
    from ltr559 import LTR559
    from bme280 import BME280
    from pms5003 import PMS5003, ReadTimeoutError as pmsReadTimeoutError
    
    # LIGHT SENSOR
    ltr559 = LTR559()
    # BME280 temperature/pressure/humidity sensor
    bme280 = BME280()
    # PMS5003 particulate sensor
    pms5003 = PMS5003()
except Exception as e: sys.exit("ERROR: {}".format(e))

def start_data_measuring(client, interval):
    pm1 = None
    pm10 = None
    pm25 = None
    
    while True:
        
        try: pm = pms5003.read()
        except pmsReadTimeoutError: pass
        else:
            pm1 = float(pm.pm_ug_per_m3(1.0)) #unit = "ug/m3"
            pm10 = float(pm.pm_ug_per_m3(10)) #unit = "ug/m3"
            pm25 = float(pm.pm_ug_per_m3(2.5)) #unit = "ug/m3"
            
        client.send_readings(data={
            "date": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            "temp": round(bme280.get_temperature(), 2),
            "proxi": round(ltr559.get_proximity()),
            "humi": round(bme280.get_humidity()), #unit = "%"
            "pres": round(bme280.get_pressure()), #unit = "hPa"
            "lux": round(ltr559.get_lux()), # unit = lux
            "pm1": round(pm1),
            "pm25": round(pm25),
            "pm10": round(pm10),
        })
        time.sleep(interval)