""" import RPi.GPIO as IO """
import sys

class Config:
    #constructor 1
    def __init__(self):
        self.factor_temp = 0
        self.factor_humi = 0
        self.settings = {}
        self.fan = None
    #constructor 2
    def __init__(self, settings):
        self.setSettings(settings)
        self.setFan(self.settings["fan_gpio"])
    #getters / setters settings
    def setSettings(self, settings):
        self.settings = settings
    def getSettings(self):
        return self.settings
    #getters / setters fan
    def setFan(self, state):
        self.fan = state
    def getFan(self):
        return self.fan 
    
    #method for activating fan
    #----> currently just prints to terminal <----
    def activateFan(self):
        # Config the fan plugged to RPi
        #IO.setmode(IO.BCM)   # Set pin numbering
        #IO.setup(4,IO.OUT)   # Fan controller on GPIO 4
        #pwm = IO.PWM(4,1000) # PWM frequency
        #pwm.start(100)       # Duty cycle
        if self.fan:
            print("Fan activated!")
        else:
            print("Fan is turned off in settings.py")
            
        