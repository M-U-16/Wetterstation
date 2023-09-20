""" import RPi.GPIO as IO """
import sys

class Config:
    def __init__(self):
        self.factor_temp = 0
        self.factor_humi = 0
        #self.settings = settings
        
    def activateFan(self, turnedOn):
        # Config the fan plugged to RPi
        #IO.setmode(IO.BCM)   # Set pin numbering
        #IO.setup(4,IO.OUT)   # Fan controller on GPIO 4
        #pwm = IO.PWM(4,1000) # PWM frequency
        #pwm.start(100)       # Duty cycle
        if turnedOn:
            print("Fan activated!")
        else:
            print("Fan is turned off in settings.py")
            
        