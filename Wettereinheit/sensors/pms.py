from datetime import datetime
try: 
    import pms5003 as pms
    from pms5003 import ReadTimeoutError as PmsReadTimeoutError
except Exception as e: exit(1)

class PmsToManyRetrys(RuntimeError): pass

class ParticleSensor:
    def __init__(self):
        self.name = "particle_sensor"
        # PMS5003 particulate sensor
        self.sensor = pms.PMS5003()
        self.retrys = 0
    
    def read(self, date=False):
        try:
            data = self.sensor.read()
            readings = {
                "pm1": data.pm_ug_per_m3(1.0), # for particles of 1 micron
                "pm10": data.pm_ug_per_m3(10), # for particles of 10 microns
                "pm25": data.pm_ug_per_m3(2.5) # for particles of 2.5 microns
            }
            if date: readings["date"] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            return readings
        except PmsReadTimeoutError:
            # recursivly calling read
            # when there are read errors
            # but only try 3 times then raise error
            if self.retrys >= 3:
                raise PmsToManyRetrys("PMS5003 to many reads")
            self.retrys += 1
            return self.read()
        
    def read_pm1(self): return self.read()["pm10"]
    def read_pm25(self): return self.read()["pm25"]
    def read_pm100(self): return self.read()["pm100"]