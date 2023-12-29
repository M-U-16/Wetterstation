CREATE TABLE wetterdaten (
    entry_id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_date DATE,
    temp INTEGER,
    humi INTEGER,
    pres INTEGER,
    lux INTEGER,
    high TEXT,
    mid TEXT,
    low TEXT,
    amp TEXT,
    oxi TEXT,
    red TEXT,
    nh3 TEXT,
    pm10 TEXT,
    pm25 TEXT,
    pm100 TEXT
);