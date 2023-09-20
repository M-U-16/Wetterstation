from time import localtime, strftime

def sum_data(data):
    totals = {"time" : data[0]["time"]}
    keys = list(data[0].keys())
    keys.remove("time")
    for key in keys:
        totals[key] = 0
    for d in data:
        for key in keys:
            totals[key] += d[key]
    count = float(len(data))
    for key in keys:
        totals[key] = round(totals[key] / count, 1)
    return totals

def record_time(r):
    t = r['time'].split()[3].split(':')
    return int(t[0]) * 60 + int(t[1])

def filename(t):
    return strftime("enviro-data/%Y_%j", localtime(t))

def get_cpu_temperature(self, turnedOn):
""" if self.temp_humi_compensation:
        # Tuning factor for compensate the temperature and humidity
        factor_temp = 3.10
        factor_humi = 1.26    
          
        with open("/sys/class/thermal/thermal_zone0/temp", "r") as f:
            temp = f.read()
            temp = int(temp) / 1000.0
            
        return temp
    else:
        return None
"""
        if turnedOn:
            print("current temperature")
        else:
            print("cpu mesurement not turned on!")