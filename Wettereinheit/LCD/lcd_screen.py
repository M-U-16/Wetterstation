import RPi.GPIO as IO
import ST7735

from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont

import os
import settings
from math import ceil

# Create ST7735 LCD display class
class lcd_screen():
    def __init__(self, settings, days, record):
        self.days = days
        self.record = record
        
        self.st7735 = ST7735.ST7735(
            port=0,
            cs=1,
            dc=9,
            backlight=12,
            rotation=270,
            spi_speed_hz=10000000
        )
        self.WIDTH = self.st7735.width
        self.HEIGHT = self.st7735.height
        
        # Set up canvas and font
        self.img = Image.new('RGB', (self.WIDTH, self.HEIGHT), color=(0, 0, 0))
        self.draw = ImageDraw.Draw(self.img)
        
        self.path = os.path.dirname(os.path.realpath(__file__)) + "/static/fonts"
        self.smallfont = ImageFont.truetype(self.path + "/asap/Asap-Bold.ttf", 10)
        self.x_offset = 2
        self.y_offset = 2
        
        self.units #init variable
        #put settings into class variables
        self.gas_sensor = settings["gas_sensor"] #true / false -> settings.py
        self.particulate_sensor = settings["particulate_sensor"] #true / false -> settings.py
    
    def init_Display(self):
        # Initialize display
        self.st7735.begin()
    
    def init_Units(self):
        self.units = ["°C", "%", "hPa", "Lux", "u", "u", "u", "u"]
        if self.gas_sensor:
            self.units += ["kΩ", "kΩ", "kΩ"]
        if self.particulate_sensor:
            self.units += ["μg/m3", "μg/m3", "μg/m3"]
            
    # Displays all the text on the 0.96" LCD  
    def display_everything(self):
        self.draw.rectangle((0, 0, self.WIDTH, self.HEIGHT), (0, 0, 0))
        column_count = 2
        variables = list(self.record.keys())
        row_count = ceil(len(self.units) / column_count)
        last_values = self.days[-1][-1]
        for i in range(len(self.units)):
            variable = variables[i + 1]
            data_value = self.record[variable]
            last_value = last_values[variable]
            self.unit = self.units[i]
            x = self.x_offset + (self.WIDTH // column_count) * (i // row_count)
            y = self.y_offset + (self.HEIGHT // row_count) * (i % row_count)
            message = "{}: {:s} {}".format(variable[:4], str(data_value), unit)
            tol = 1.01
            rgb = (255, 0, 255) if data_value > last_value * tol  else (0, 255, 255) if data_value < last_value / tol else (0, 255, 0)
            self.draw.text((x, y), message, font = self.smallfont, fill = rgb)
        self.st7735.display(self.img)