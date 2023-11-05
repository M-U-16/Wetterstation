DROP TABLE IF EXISTS wetterdaten;
CREATE TABLE wetterdaten (
    entry_id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_date DATE,
    entry_time TEXT,
    temp INTEGER,
    humi INTEGER,
    pres INTEGER,
    lux INTEGER
);