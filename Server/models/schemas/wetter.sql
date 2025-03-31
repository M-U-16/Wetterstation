CREATE TABLE IF NOT EXISTS wetterdaten (
    entry_id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_date DATE,
    temp INTEGER,
    humi INTEGER,
    pres INTEGER,
    lux INTEGER,
    prox INTEGER,
    noise TEXT,
    pm_10 TEXT,
    pm_25 TEXT,
    pm_100 TEXT
);

CREATE TABLE IF NOT EXISTS gas (
    entry_id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_date DATE,
    oxi TEXT,
    red TEXT,
    nh3 TEXT
);