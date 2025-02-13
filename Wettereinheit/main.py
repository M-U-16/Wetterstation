# standard libraries
import os
import sys

# internal libraries
from sensors import SensorGroup
from config import get_config
from socketClient import get_client

# isFake exists only to test the program and server
# without the actual sensors
# random values are generated and send to the server 
isFake = os.getenv("WETTEREINHEIT_IS_FAKE", "False") == "True"

if isFake:
    from sensors.fake import GasSensorFake
    from sensors.fake import Bme280SensorFake
    from sensors.fake import Ltr559SensorFake
    from sensors.fake import ParticleSensorFake
else:
    from sensors.bme import Bme280Sensor
    from sensors.ltr import Ltr559Sensor
    from sensors.pms import ParticleSensor
    from sensors.gas import GasSensor

config = get_config("pi.ini")

# websocket client to send live data
client = get_client()
        
def main():
    sensors = []
    if isFake:
        sensors = [
            Bme280SensorFake(),
            Ltr559SensorFake(),
            ParticleSensorFake(),
            GasSensorFake(start_up_time=10)
        ]
    else:
        sensors = [
            Bme280Sensor(),
            Ltr559Sensor(),
            GasSensor(),
            ParticleSensor(),
        ]
        
    sensor_group = SensorGroup(
        client, 10,
        sensors=sensors,
        do_print=isFake,
        is_fake=isFake,
        send=True
    )
    
    try:
        # connect to server
        if isFake:
            client.io.connect(
                "http://localhost:8080",
                namespaces="/pi",
                auth={"key": config["server"]["key"]}
            )
        else:
            client.io.connect(
                config["server"]["url"],
                namespaces="/pi",
                auth={"key": config["server"]["key"]}
            )
        
        sensor_group.run()
        client.io.wait()
        # infinite loop for staying connected to server
        # via websocket connection
        #while True: time.sleep(0.5)
            
    except KeyboardInterrupt:
        client.io.disconnect() # disconnecting from server
        sys.exit(0)
    except Exception as e:
        sys.exit(">> ERROR: {}".format(e))

if __name__ == "__main__": main()