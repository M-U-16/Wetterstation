import time
from threading import Thread
from datetime import datetime

class ExceptionWarmUpNotDone(RuntimeError): pass

class SensorGroup(Thread):
    def __init__(
        self, client, interval,
        sensors, daemon=True,
        do_print=False, send=True, is_fake=False
    ):
        """
        SensorGroup is a simple class used to group sensors
        with same the *interval* and gather all readings
        from the supplied *sensors* and send them over to
        the server with *client* all within another
        thread

        Args:
            client: SocketIoClient
                The websocket connection to server
            interval: int
                The time to wait for next reading. Defaults to 10.
            sensors: list
                list of sensors to monitor
            do_print: bool  
                print to sensor readings to console
            send: bool
                print to sensor readings to console
        """
        
        # call Thread constructor
        super().__init__(daemon=daemon)
        
        self.daemon = daemon
        self.sensors = sensors
        self.print = do_print
        self.send = send
        self.client = client
        self.interval = interval
        self.is_fake = is_fake
    
    def run(self):
        while True:
            readings = {}
            for sensor in self.sensors:
                try:
                    readings[sensor.name] = sensor.read()
                except ExceptionWarmUpNotDone: pass
                
            readings["date"] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            if self.is_fake:
                readings["is_fake"] = self.is_fake
            if self.send and self.client:
                self.client.send_readings(data=readings)
            if self.print: print(readings)
            time.sleep(self.interval)