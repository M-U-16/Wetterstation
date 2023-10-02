SETTINGS = {
    # If you prefer to keep the Enviro LCD screen off, change the next value to False
    "lcd_screen": True,
    # If you don't have a fan plugged on GPIO, change the next value to False
    "fan_gpio": True,
    # Temperature and humidity compensation (edit values 'factor_temp' and 'factor_humi' to adjust them)
    "temp_humi_compensation": True,
    # If you have an Enviro board without gas sensor, change the next value to False
    "gas_sensor": True,
    # If you don't have a particle sensor PMS5003 attached, change the next value to False
    "particulate_sensor": True,
    #ip for sending data to flask server
    "ip_address": "localhost",
    #port number
    "server_port": "80",
    #send data
    "send_data": True,
    #save data
    "save_data": True,
    #send pi settings
    "send_pi_settings": True,
    #default settings for fan
    "fan": 100,
    #server
    "server": True,
    #logging
    "logging": True
}