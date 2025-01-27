CREATE TABLE IF NOT EXISTS meta_data(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cpu_temp REAL,
    is_alive INTEGER NOT NULL,
    date DATETIME
);

CREATE TABLE IF NOT EXISTS device_lookup(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_name varchar(100) UNIQUE
);

CREATE TABLE IF NOT EXISTS device_settings(
    device_id INTEGER,
    setting_name varchar(100),
    setting_value TEXT,
    
    FOREIGN KEY(device_id) REFERENCES device_lookup(id)
);