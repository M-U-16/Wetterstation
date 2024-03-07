from sensors.bme import BME
from multiprocessing import Queue, Process, Pipe

dataQueue = Queue()

# temperature, humidity and pressure sensor
thpSensor = BME(
    address=0x76, #address=i2c address of sensor
    timeout=1 # time sensor should wait
)

# thp pipes for communication to process
thpSensorPipe, thpMainPipe = Pipe(duplex=True)
# thp process
thpProcess = Process(
    target=thpSensor.start,
    args=(thpSensorPipe, dataQueue,)
)

if __name__ == "__main__":
    #thpProcess.start()

    currentItems = 0
    while True:
        if not dataQueue.empty():
            item = dataQueue.get()
            currentItems += 1
            print("item count: {}\n".format(currentItems), item)

        if currentItems >= 10:
            thpMainPipe.send("stop-running")
            msg = thpMainPipe.recv()
            if msg == "process-stopped":
                print(msg)
                break
            else:
                print("ERROR: could not stop process msg: ", msg)
                print("stopping main thread")
                break

    thpProcess.join()