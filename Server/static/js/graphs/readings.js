// Show live readings in
function listReadings(d) {
  dataReadings = d;
  for (let i = 0; i < Object.keys(dataReadings).length; i++) {
    let dataKey = Object.keys(dataReadings)[i];
    let elementIdKey = document.getElementById(dataKey);
    let dataValue = Object.values(dataReadings)[i];
    if (typeof elementIdKey != "undefined" && elementIdKey != null) {
      elementIdKey.innerHTML = dataValue;
      if (dataKey === "temp") {
        const temp_f = dataValue * 1.8 + 32;
        document.getElementById("temp-f").innerHTML = temp_f.toFixed(1);
      }
    }
  }
}