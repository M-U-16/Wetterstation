DROP TABLE IF EXISTS wetterdaten;
CREATE TABLE wetterdaten (
    entry_id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_date date,
    entry_day_text TEXT,
    temp int,
    humi int,
    pres int,
    lux int
);