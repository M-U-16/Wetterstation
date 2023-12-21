function itemBuilder(id, label, unit, color, min, max) {
  return {
    id: id,
    label: label,
    unit: unit,
    color: color,
    min: min,
    max: max
  }
}
const items_ngp = {
  temp: itemBuilder("temp", "Temperature", "°C", style.getPropertyValue("--color-red"), 0, 50),
  humi: itemBuilder("humi", "Humidity", "%", style.getPropertyValue("--color-blue"), 0, 100),
  pres: itemBuilder("pres", "Pressure", "hPa", style.getPropertyValue("--color-green"), 950, 150),
  lux: itemBuilder("lux", "Light", "lux", style.getPropertyValue("--color-yellow"), 0, 25000),
  high: itemBuilder("high", "High", "u", style.getPropertyValue("--color-noise-high"), 0, 300),
  mid: itemBuilder("mid", "Mid", "u", style.getPropertyValue("--color-noise-mid"), 0, 300),
  low: itemBuilder("low", "Low", "u", style.getPropertyValue("--color-noise-low"), 0, 300),
  amp: itemBuilder("amp", "Amp", "u", style.getPropertyValue("--color-noise-amp"), 0, 300),
};
const items_gas = {
  nh3: itemBuilder("nh3", "NH3", "kΩ", style.getPropertyValue("--color-olive"), 0, 600),
  oxi: itemBuilder("oxi", "Oxidising", "kΩ", style.getPropertyValue("--color-violet"), 0, 1000),
  red: itemBuilder("red", "Reducing", "kΩ", style.getPropertyValue("--color-turquoise"), 0, 400)
};
const items_pm = {
  pm10: itemBuilder("pm10", "PM10.0", "μg/m3", style.getPropertyValue("--color-dust10"), 0, 800),
  pm25: itemBuilder("pm25", "PM2.5", "μg/m3", style.getPropertyValue("--color-dust25"), 0, 800),
  pm100: itemBuilder("pm100", "PM100", "μg/m3", style.getPropertyValue("--color-dust100"), 0, 800)
};
if (particulate_sensor) {
  items = { ...items_ngp, ...items_gas, ...items_pm };
} else {
  if (gas_sensor) {
    items = { ...items_ngp, ...items_gas };
  } else {
    items = items_ngp;
  }
}