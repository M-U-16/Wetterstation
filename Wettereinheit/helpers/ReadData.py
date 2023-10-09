from settings import SETTINGS
from time import sleep, time, asctime, localtime, strftime, gmtime
from bme280 import BME280
from enviroplus import gas
from enviroplus.noise import Noise
from pms5003 import PMS5003, ReadTimeoutError as pmsReadTimeoutError
assert SETTINGS["gas_sensor"] or not particulate_sensor

try:
    # Transitional fix for breaking change in LTR559
    from ltr559 import LTR559
    ltr559 = LTR559()
except ImportError:
    import ltr559
    
try:
    from smbus2 import SMBus
except ImportError:
    from smbus import SMBus

bus = SMBus(1)
# BME280 temperature, humidity and pressure sensor
bme280 = BME280(i2c_dev=bus)
# PMS5003 particulate sensor
pms5003 = PMS5003()
# Noise sensor
noise = Noise()

# Tuning factor for compensate the temperature and humidity
factor_temp = 3.10
factor_humi = 1.26

def get_cpu_temperature():
        with open("/sys/class/thermal/thermal_zone0/temp", "r") as f:
            temp = f.read()
            temp = int(temp) / 1000.0
        return temp

def read_data():

    if SETTINGS["temp_humi_compensation"]:
        cpu_temps = [get_cpu_temperature()] * 5
        cpu_temp = get_cpu_temperature()
        # Smooth out with some averaging to decrease jitter
        cpu_temps = cpu_temps[1:] + [cpu_temp]
        avg_cpu_temp = sum(cpu_temps) / float(len(cpu_temps))
        raw_temp = bme280.get_temperature()
        temperature = raw_temp - ((avg_cpu_temp - raw_temp) / factor_temp)
        raw_humi = bme280.get_humidity()
        humidity = raw_humi * factor_humi
    else:
        temperature = bme280.get_temperature()
        humidity = bme280.get_humidity()

    pressure = bme280.get_pressure()
    lux = ltr559.get_lux()
    low, mid, high, amp = noise.get_noise_profile()
    low *= 128
    mid *= 128
    high *= 128
    amp *= 64

    if SETTINGS["gas_sensor"]:
        gases = gas.read_all()
        oxi = round(gases.oxidising / 1000, 1)
        red = round(gases.reducing / 1000)
        nh3 = round(gases.nh3 / 1000)
    else:
        oxi = red = nh3 = 0

    if SETTINGS["particulate_sensor"]:
        while True:
            try:
                particles = pms5003.read()
                break
            except RuntimeError as e:
                print("Particle read failed:", e.__class__.__name__)
                if not run_flag:
                    raise e
                pms5003.reset()
                sleep(30)
        pm100 = particles.pm_ug_per_m3(10)
        pm25  = particles.pm_ug_per_m3(2.5)
        pm10  = particles.pm_ug_per_m3(1.0)
    else:
        pm100 = pm25 = pm10 = 0

    record = {
        #"time": " ".join(list(filter(lambda x: x != "", asctime(localtime()).split(" ")))),
        'time' : asctime(localtime(time)),
        'temp' : round(temperature,1),
        'humi' : round(humidity,1),
        'pres' : round(pressure,1),
        'lux'  : round(lux),
        'high' : round(high,2),
        'mid'  : round(mid,2),
        'low'  : round(low,2),
        'amp'  : round(amp,2),        
        'oxi'  : oxi,
        'red'  : red,
        'nh3'  : nh3,
        'pm10' : pm10,
        'pm25' : pm25,
        'pm100': pm100,
    }
    return record 