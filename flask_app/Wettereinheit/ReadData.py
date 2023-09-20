from time import sleep, time, asctime, localtime, strftime, gmtime
import random
""" from bme280 import BME280 """

# BME280 temperature, humidity and pressure sensor
    #bme280 = BME280(i2c_dev=bus)
# PMS5003 particulate sensor
    #pms5003 = PMS5003()
# Noise sensor
    #noise = Noise()

def read_data():

    """ if temp_humi_compensation:
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

    if gas_sensor:
        gases = gas.read_all()
        oxi = round(gases.oxidising / 1000, 1)
        red = round(gases.reducing / 1000)
        nh3 = round(gases.nh3 / 1000)
    else:
        oxi = red = nh3 = 0

    if particulate_sensor:
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
    """
    return {
        "time": asctime(localtime()),
        "temp": random.randrange(0,34),
        "humi": random.randrange(0,100),
        "pres": random.randrange(1, 1000),
        "lux": random.randrange(1, 100),
        "high": None,
        "mid": None,
        "low": None,
        "amp": None,
        "oxi": None,
        "red": None,
        "nh3": None,
        "pm10": None,
        "pm25": None,
        "pm100": None,
    }