try:
    # Transitional fix for breaking change in LTR559
    from ltr559 import LTR559
    ltr559 = LTR559()
except ImportError:
    import ltr559

from enviroplus import gas
assert gas_sensor or not particulate_sensor # Can't have particle sensor without gas sensor
from enviroplus.noise import Noise
from pms5003 import PMS5003, ReadTimeoutError as pmsReadTimeoutError
import RPi.GPIO as IO
import ST7735

from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont

try:
    from smbus2 import SMBus
except ImportError:
    from smbus import SMBus

from math import ceil, floor
from time import sleep, time, asctime, localtime, strftime, gmtime

bus = SMBus(1)

# Throw away the first readings as not accurate
record = read_data(time())
data = []
days = []

# Number of 1 second samples average per file record
samples = 600
samples_per_day = 24 * 3600 // samples

def add_record(day, record):
    # If not the first record of the day
    if record_time(record) > 0:
        while len(day) == 0 or record_time(day[-1]) < record_time(record) - samples // 60: # Is there a gap
            if len(day):
                # Duplicate the last record to forward fill
                filler = dict(day[-1])
                t = record_time(filler) + samples // 60
            else:
                filler = dict(record) # Need to back fill
                t = 0                 # Only happens if the day is empty so most be the first entry
            old_time = filler["time"] # Need to fix the time field
            colon_pos = old_time.find(':')
            filler["time"] = old_time[:colon_pos - 2] + ("%02d:%02d" % (t / 60, t % 60)) + old_time[colon_pos + 3:]
            day.append(filler)
    day.append(record)

def background():
    global record, data
    sleep(2)
    last_file = None
    while run_flag:
        t = int(floor(time()))
        record = read_data(t)
        # Keep five minutes
        data = data[-(samples - 1):] + [record]
        # At the end of a 5 minute period?
        if t % samples == samples - 1 and len(data) == samples:
            totals = sum_data(data)
            fname = filename(t - (samples - 1))
            with open(fname, "a+") as f:
                f.write(json.dumps(totals) + '\n')
            # Handle new day
            if not days or (last_file and last_file != fname):
                days.append([])
            last_file = fname
            # Add to today, filling any gap from last reading if been stopped
            add_record(days[-1], totals)
        if lcd_screen and days:
            display_everything()
        sleep(max(t + 1 - time(), 0.1))