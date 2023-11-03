DROP TABLE IF EXISTS wetterdaten;
CREATE TABLE wetterdaten (
    entry_id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    entry_year int,
    entry_month int,
    entry_day int,
    entry_day_text TEXT,
    entry_time date,
    temp int,
    humi int,
    pres int,
    lux int
);