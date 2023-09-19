/** EnviroPlusWeb **/
/* https://gitlab.com/idotj/enviroplusweb */
const frequencies = {
  day: { major: 3 * 3600, minor: 3600, poll: 60 },
  week: { major: 24 * 3600, minor: 6 * 3600, poll: 600 },
  month: { major: 7 * 24 * 3600, minor: 24 * 3600, poll: 1440 },
  year: { major: 31 * 24 * 3600, minor: 7 * 24 * 3600, poll: 17280 },
};
const gas_sensor = body.dataset.hasgassensor;
const particulate_sensor = body.dataset.hasparticulatesensor;
const fan_gpio = body.dataset.hasfangpio;
const style = getComputedStyle(document.body);

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
let items;
if (particulate_sensor) {
  items = { ...items_ngp, ...items_gas, ...items_pm };
} else {
  if (gas_sensor) {
    items = { ...items_ngp, ...items_gas };
  } else {
    items = items_ngp;
  }
}
let firstRun = true;
let dataReadings;
let transformedData;
let frequency;
let last_frequency = "";
let last_graph = 0;
const ctxTemp = document.getElementById("graphChartTemp");
const ctxHumi = document.getElementById("graphChartHumi");
const ctxPres = document.getElementById("graphChartPres");
const ctxLux = document.getElementById("graphChartLux");
const ctxNoise = document.getElementById("graphChartNoise");
const ctxGas = document.getElementById("graphChartGas");
const ctxPm = document.getElementById("graphChartPm");
let graphChartTemp;
let graphChartHumi;
let graphChartPres;
let graphChartLux;
let graphChartNoise;
let graphChartGas;
let graphChartPm;

// Request to get readings data
function getData() {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // console.log('getData(): ', JSON.parse(this.responseText));
      listReadings(JSON.parse(this.responseText));
    }
  };
  if (fan_gpio) {
    let fan = document.getElementById("fan").value;
    xhttp.open("GET", "readings?fan=" + fan, true);
  } else {
    xhttp.open("GET", "readings", true);
  }
  xhttp.send();
}

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

// Request to get graph data
function getGraph() {
  frequency = document.getElementById("graph-sel").value;
  let t = Date.now() / 1000;
  if (
    frequency != last_frequency ||
    t - last_graph >= frequencies[frequency].poll
  ) {
    last_frequency = frequency;
    last_graph = t;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log("getGraph(): ", JSON.parse(this.responseText));
        transformedData = JSON.parse(this.responseText).map((element) => {
          return {
            // Normalize data for the graph
            time: new Date(element.time).toISOString(),
            temp: element.temp,
            humi: element.humi,
            pres: element.pres,
            lux: element.lux,
            high: element.high,
            mid: element.mid,
            low: element.low,
            amp: element.amp,
            nh3: element.nh3,
            red: element.red,
            oxi: element.oxi,
            pm10: element.pm10,
            pm100: element.pm100,
            pm25: element.pm25,
          };
        });

        //looks if it is first run when it is sets firstrun false
        //starts to destroy all charts for each iteration
        !firstRun ? destroyAllCharts() : firstRun = false
        //draw the graphs
        drawGraph(transformedData);
      }
    };

    xhttp.open("GET", "graph?time=" + frequency, true);
    xhttp.send();
  }
}

// Reload graph chart
function destroyAllCharts() {
  graphChartTemp.destroy();
  graphChartHumi.destroy();
  graphChartPres.destroy();
  graphChartLux.destroy();
  graphChartNoise.destroy();
  if (gas_sensor) graphChartGas.destroy();
  if (particulate_sensor) graphChartPm.destroy();
}

// Draw graph with data
//get the current frequency depending on time period
function getFrequency(frequency) {
  if (frequency === "day") return "hour"
  if (frequency === "week") return "day"
  if (frequency === "month") return "day"
  if (frequency === "year") return "month"
  return frequency
}

function drawGraph(data) {
  // console.log("drawGraph(): ", data);

  // Change time range to read better the X axis
  let graphfrequency = getFrequency(frequency)
  
  // Push data for chartJS
  graphChartTemp = new Chart(ctxTemp, {
    type: "line",
    data: {
      datasets: [
        {
          label: items.temp.id,
          data: data,
          parsing: {
            yAxisKey: items.temp.id,
          },
          borderColor: items.temp.color,
          borderWidth: 2,
          pointBackgroundColor: items.temp.color,
          pointRadius: 1,
        },
      ],
    },
    options: {
      bezierCurve: true,
      tension: 0.9,
      maintainAspectRatio: false,
      scales: {
        y: {
          grace: "90%",
          ticks: {
            callback: function (value) {
              return value + items.temp.unit;
            },
          },
        },
        x: {
          type: "time",
          time: {
            unit: graphfrequency,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
      parsing: {
        xAxisKey: "time",
      },
      animation: {
        onComplete: function () {
          ctxTemp.classList.remove("loading-spinner");
        },
      },
    },
  });

  graphChartHumi = new Chart(ctxHumi, {
    type: "line",
    data: {
      datasets: [
        {
          label: items.humi.id,
          data: data,
          parsing: {
            yAxisKey: items.humi.id,
          },
          borderColor: items.humi.color,
          borderWidth: 2,
          pointBackgroundColor: items.humi.color,
          pointRadius: 1,
        },
      ],
    },
    options: {
      bezierCurve: true,
      tension: 0.3,
      maintainAspectRatio: false,
      scales: {
        y: {
          grace: "90%",
          ticks: {
            stepSize: 5,
            callback: function (value) {
              return value + items.humi.unit;
            },
          },
        },
        x: {
          type: "time",
          time: {
            unit: graphfrequency,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
      parsing: {
        xAxisKey: "time",
      },
      animation: {
        onComplete: function () {
          ctxHumi.classList.remove("loading-spinner");
        },
      },
    },
  });

  graphChartPres = new Chart(ctxPres, {
    type: "line",
    data: {
      datasets: [
        {
          label: items.pres.id,
          data: data,
          parsing: {
            yAxisKey: items.pres.id,
          },
          fill: items.pres.color,
          borderColor: items.pres.color,
          borderWidth: 2,
          pointBackgroundColor: items.pres.color,
          pointRadius: 1,
        },
      ],
    },
    options: {
      bezierCurve: true,
      tension: 0.6,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: items.pres.min,
          max: items.pres.max,
          ticks: {
            stepSize: 20,
            callback: function (value) {
              return value + " " + items.pres.unit;
            },
          },
        },
        x: {
          type: "time",
          time: {
            unit: graphfrequency,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
      parsing: {
        xAxisKey: "time",
      },
      animation: {
        onComplete: function () {
          ctxPres.classList.remove("loading-spinner");
        },
      },
    },
  });

  graphChartLux = new Chart(ctxLux, {
    type: "line",
    data: {
      datasets: [
        {
          label: items.lux.id,
          data: data,
          parsing: {
            yAxisKey: items.lux.id,
          },
          borderColor: items.lux.color,
          borderWidth: 2,
          pointBackgroundColor: items.lux.color,
          pointRadius: 1,
        },
      ],
    },
    options: {
      bezierCurve: true,
      tension: 0.2,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grace: "40%",
          ticks: {
            stepSize: 100,
            callback: function (value) {
              return value + " " + items.lux.unit;
            },
          },
        },
        x: {
          type: "time",
          time: {
            unit: graphfrequency,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
      parsing: {
        xAxisKey: "time",
      },
      animation: {
        onComplete: function () {
          ctxLux.classList.remove("loading-spinner");
        },
      },
    },
  });

  graphChartNoise = new Chart(ctxNoise, {
    type: "line",
    data: {
      datasets: [
        {
          label: items.high.id,
          data: data,
          parsing: {
            yAxisKey: items.high.id,
          },
          yAxisID: "y",
          borderColor: items.high.color,
          borderWidth: 2,
          pointBackgroundColor: items.high.color,
          pointRadius: 1,
        },
        {
          label: items.mid.id,
          data: data,
          parsing: {
            yAxisKey: items.mid.id,
          },
          yAxisID: "y1",
          borderColor: items.mid.color,
          borderWidth: 2,
          pointBackgroundColor: items.mid.color,
          pointRadius: 1,
        },
        {
          label: items.low.id,
          data: data,
          parsing: {
            yAxisKey: items.low.id,
          },
          yAxisID: "y2",
          borderColor: items.low.color,
          borderWidth: 2,
          pointBackgroundColor: items.low.color,
          pointRadius: 1,
        },
        {
          label: items.amp.id,
          data: data,
          parsing: {
            yAxisKey: items.amp.id,
          },
          yAxisID: "y3",
          borderColor: items.amp.color,
          borderWidth: 2,
          pointBackgroundColor: items.amp.color,
          pointRadius: 1,
        },
      ],
    },
    options: {
      bezierCurve: true,
      tension: 0.1,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: items.high.min,
          max: items.high.max,
          ticks: {
            callback: function (value) {
              return value + " " + items.high.unit;
            },
          },
        },
        y1: {
          min: items.high.min,
          max: items.high.max,
          display: false,
        },
        y2: {
          min: items.high.min,
          max: items.high.max,
          display: false,
        },
        y3: {
          min: items.high.min,
          max: items.high.max,
          display: false,
        },
        x: {
          type: "time",
          time: {
            unit: graphfrequency,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
      parsing: {
        xAxisKey: "time",
      },
      animation: {
        onComplete: function () {
          ctxNoise.classList.remove("loading-spinner");
        },
      },
    },
  });

  graphChartGas = new Chart(ctxGas, {
    type: "line",
    data: {
      datasets: [
        {
          label: items.nh3.id,
          data: data,
          parsing: {
            yAxisKey: items.nh3.id,
          },
          yAxisID: "y",
          borderColor: items.nh3.color,
          borderWidth: 2,
          pointBackgroundColor: items.nh3.color,
          pointRadius: 1,
        },
        {
          label: items.red.id,
          data: data,
          parsing: {
            yAxisKey: items.red.id,
          },
          yAxisID: "y1",
          borderColor: items.red.color,
          borderWidth: 2,
          pointBackgroundColor: items.red.color,
          pointRadius: 1,
        },
        {
          label: items.oxi.id,
          data: data,
          parsing: {
            yAxisKey: items.oxi.id,
          },
          yAxisID: "y2",
          borderColor: items.oxi.color,
          borderWidth: 2,
          pointBackgroundColor: items.oxi.color,
          pointRadius: 1,
        },
      ],
    },
    options: {
      bezierCurve: true,
      tension: 0.2,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: items.oxi.min,
          max: items.oxi.max,
          ticks: {
            callback: function (value) {
              return value + " " + items.oxi.unit;
            },
          },
        },
        y1: {
          min: items.red.min,
          max: items.red.max,
          display: false,
        },
        y2: {
          min: items.oxi.min,
          max: items.oxi.max,
          display: false,
        },
        x: {
          type: "time",
          time: {
            unit: graphfrequency,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
      parsing: {
        xAxisKey: "time",
      },
      animation: {
        onComplete: function () {
          ctxGas.classList.remove("loading-spinner");
        },
      },
    },
  });

  graphChartPm = new Chart(ctxPm, {
    type: "line",
    data: {
      datasets: [
        {
          label: items.pm10.id,
          data: data,
          parsing: {
            yAxisKey: items.pm10.id,
          },
          yAxisID: "y",
          borderColor: items.pm10.color,
          borderWidth: 2,
          pointBackgroundColor: items.pm10.color,
          pointRadius: 1,
        },
        {
          label: items.pm100.id,
          data: data,
          parsing: {
            yAxisKey: items.pm100.id,
          },
          yAxisID: "y1",
          borderColor: items.pm100.color,
          borderWidth: 2,
          pointBackgroundColor: items.pm100.color,
          pointRadius: 1,
        },
        {
          label: items.pm25.id,
          data: data,
          parsing: {
            yAxisKey: items.pm25.id,
          },
          yAxisID: "y2",
          borderColor: items.pm25.color,
          borderWidth: 2,
          pointBackgroundColor: items.pm25.color,
          pointRadius: 1,
        },
      ],
    },
    options: {
      bezierCurve: true,
      tension: 0.2,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: items.pm10.min,
          max: items.pm10.max,
          ticks: {
            callback: function (value) {
              return value + " " + items.pm100.unit;
            },
          },
        },
        y1: {
          min: items.pm100.min,
          max: items.pm100.max,
          display: false,
        },
        y2: {
          min: items.pm25.min,
          max: items.pm25.max,
          display: false,
        },
        x: {
          type: "time",
          time: {
            unit: graphfrequency,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
      parsing: {
        xAxisKey: "time",
      },
      animation: {
        onComplete: function () {
          ctxPm.classList.remove("loading-spinner");
        },
      },
    },
  });
}

// Call a function repetitively with 1 second interval
/* setInterval(function () {
  getData();
  getGraph();
}, 900); */ // ~1s update rate

/* window.addEventListener("resize", function () {
  destroyAllCharts();
  drawGraph(transformedData);
}); */
