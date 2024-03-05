from sensors.bme import BME

thp_sensor = BME(address=0x76, timeout=1)
thp_sensor.read()
