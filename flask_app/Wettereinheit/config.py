import RPi.GPIO as IO
import sys

class Config():
    def __init__(self, settings):
        self.fan_gpio = settings.fan_gpio
        self.temp_humi_compensation = settings.temp_humi_compensation
        self.factor_temp
        self.factor_humi   
        
    def activateFan(self):
        # Config the fan plugged to RPi
        if self.fan_gpio:
            IO.setmode(IO.BCM)   # Set pin numbering
            IO.setup(4,IO.OUT)   # Fan controller on GPIO 4
            pwm = IO.PWM(4,1000) # PWM frequency
            pwm.start(100)       # Duty cycle
            print("Fan activated!")
        else:
            print("Fan is not activated")
    
    def get_cpu_temperature(self):
        if self.temp_humi_compensation:
            # Tuning factor for compensate the temperature and humidity
            self.factor_temp = 3.10
            self.factor_humi = 1.26    
            
            with open("/sys/class/thermal/thermal_zone0/temp", "r") as f:
            temp = f.read()
            temp = int(temp) / 1000.0
            
            return temp
        else:
            return "Cpu mesurement not activated!"
        