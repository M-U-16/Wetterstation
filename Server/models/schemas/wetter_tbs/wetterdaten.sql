CREATE TABLE IF NOT EXISTS wetterdaten (
    entry_id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_date DATE,
    temp INTEGER,
    humi INTEGER,
    pres INTEGER,
    lux INTEGER,
    proxi INTEGER,
    noise TEXT,
    pm10 TEXT,
    pm25 TEXT,
    pm100 TEXT
);