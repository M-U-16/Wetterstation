import sys
import ltr559
import ST7735
import platform
import threading
from time import sleep
from smbus2 import SMBus
from bme280 import BME280
from enviroplus import gas
from pms5003 import PMS5003
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont

bus = SMBus(1)
bme280 = BME280(i2c_dev=bus)
pms5003 = PMS5003()

def test():
    thread_start = datetime.now().strftime("%H:%M:%S")
    while True:
        sleep(1000)
    thread_end = datetime.now().strftime("%H:%M:%S")
    
    print("Programm Start: " + thread_start)
    print("Programm Ende: " + thread_end)
    
def readings():
    temp = bme280.get_temperature()
    pressure = bme280.get_pressure()
    humidity = bme280.get_humidity()
    lux = ltr559.get_lux()
    proximty = ltr559.get_proximity()
    gas = gas.read_all()
    pm = pms5003.read()    
    

if __name__ == "__main__":
    #bg_thread = threading.Thread(target=test)
    #bg_thread.start()

    print("--- STARTING MEASURING ---")
    print("CTRL-C to exit the script")
    while True:
        readings()
        sleep(500)