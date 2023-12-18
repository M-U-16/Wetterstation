const gas_sensor = body.dataset.hasgassensor;
const particulate_sensor = body.dataset.hasparticulatesensor;
const fan_gpio = body.dataset.hasfangpio;
const style = getComputedStyle(document.body);
console.log(gas_sensor, particulate_sensor, fan_gpio)

let graphChartTempInput, graphChartHumiInput, graphChartPresInput, graphChartLuxInput
let graphChartNoiseInput, graphChartGasInput, graphChartPmInput

const ctxTemp = document.getElementById("graphChartTempInput")
const ctxHumi = document.getElementById("graphChartHumiInput")
const ctxPres = document.getElementById("graphChartPresInput")
const ctxLux = document.getElementById("graphChartLuxInput")
const ctxNoise = document.getElementById("graphChartNoiseInput")
const ctxGas = document.getElementById("graphChartGasInput")
const ctxPm = document.getElementById("graphChartPmInput")

let firstRun = true;
let dataReadings;
let transformedData;
let frequency;
let last_frequency = "";
let last_graph = 0;
let items;

const frequencies = {
  day: { major: 3 * 3600, minor: 3600, poll: 60 },
  week: { major: 24 * 3600, minor: 6 * 3600, poll: 600 },
  month: { major: 7 * 24 * 3600, minor: 24 * 3600, poll: 1440 },
  year: { major: 31 * 24 * 3600, minor: 7 * 24 * 3600, poll: 17280 },
};

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
  frequency = document.getElementById("time-select-button").dataset.current
  console.log(frequency)
  let currentTime = Date.now() / 1000;
  if (
    frequency != last_frequency //|| currentTime - last_graph >= frequencies[frequency].poll
  ) {
    /* last_frequency = frequency; */
    last_graph = currentTime;

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log("getGraph(): ", JSON.parse(this.responseText).data);
        res = JSON.parse(this.responseText)
        /* console.log(res) */
        /* data = res.data
        console.log(data) */
        /* data.forEach(entry => console.log(entry)) */
        
        /* transformedData = JSON.parse(this.responseText).map((element) => {
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
        }); */
        //console.log(transformedData)
        //looks if it is first run when it is sets firstrun false
        /* !firstRun ? destroyAllCharts() : firstRun = false */
        //draw the graphs
        /* drawGraph(transformedData); */
      }
    };

    xhttp.open("GET", "/api/data?time=" + frequency, true);
    xhttp.send();
  }
}
// Reload graph chart
function destroyAllCharts() {
  graphChartTempInput.destroy();
  graphChartHumiInput.destroy();
  graphChartPresInput.destroy();
  graphChartLuxInput.destroy();
  graphChartNoiseInput.destroy();
  if (gas_sensor) graphChartGasInput.destroy();
  if (particulate_sensor) graphChartPmInput.destroy();
}
//get the current frequency depending on time period
function getFrequency(frequency) {
  if (frequency === "day") return "hour"
  if (frequency === "week") return "day"
  if (frequency === "month") return "day"
  if (frequency === "year") return "month"
  return frequency
}

const default_config = {
  type: "line",
  data: { datasets: [] },
  options: {},
}

function datasetBuilder(items, data) {
  const datasets = []
  
  items.forEach(item => {
    const set = {}

    set.label = item.id
    set.data = data
    set.parsing = {
      yAxisKey: item.id
    }
    set.borderColor = item.color
    set.borderWidth = 2
    set.pointRadius = 1
    set.pointBackgroundColor = item.color

    datasets.push(set)
  })
  return datasets
}
function optionsBuilder(context, settings) {

  const options = {}
  options.bezierCurve = true
  options.maintainAspectRatio = false
  options.tension = settings.tension
  options.plugins = {
    legend: {
      display: false,
    },
  }
  options.parsing = {
    xAxisKey: "time",
  }
  options.animation = {
    onComplete: function () {
      context.classList.remove("loading-spinner");
    },
  }
  options.scales = {}
  options.scales.x = {
    type: "time",
    time: {
      unit: settings.frequency
    }
  }
  settings.scalesValues.y.forEach(element => {
    const elementKeys = Object.keys(element)
    elementKeys.forEach(key => { if (key !== "name") options.scales[element.name] = element } )
  });
  return options
}

function drawGraph(data) {
  // console.log("drawGraph(): ", data);
  // Change time range to better read the X axis
  let graphfrequency = getFrequency(frequency)
  
  const graphChartTemp = { ...default_config }
  const graphChartTempSettings = {
    tension: 0.9,
    frequency: graphfrequency,
    scalesValues: {
      y: [
        {
          name: "y",
          grace: "90%",
          ticks: {
            callback: function (value) {
              return value + items.temp.unit;
            },
          },
        }
      ]
    }
  }

  const graphChartHumi = { ...default_config }
  const graphChartHumiSettings = {
    tension: 0.3,
    frequency: graphfrequency,
    scalesValues: {
      y: [
        {
          name: "y",
          grace: "90%",
          ticks: {
            callback: function (value) {
              return value + items.temp.unit;
            },
          },
        }
      ]
    }
  }

  const graphChartPres = { ...default_config }
  const graphChartPresSettings = {
    tension: 0.6,
    frequency: graphfrequency,
    scalesValues: {
      y:[
        {
          name: "y",
          grace: "90%",
          ticks: {
            callback: function (value) {
              return value + items.temp.unit;
            },
          },
        }
      ]
    }
  }
  
  const graphChartLux = { ...default_config }
  const graphChartLuxSettings = {
    tension: 0.2,
    frequency: graphfrequency,
    scalesValues: {
      y: [
        {
          name: "y",
          beginAtZero: true,
          grace: "40%",
          ticks: {
            stepSize: 100,
            callback: function (value) {
              return value + " " + items.lux.unit;
            },
          },
        }
      ]
    }
  }
  
  const graphChartNoise = { ...default_config }
  const graphChartNoiseSettings = {
    tension: 0.1,
    frequency: graphfrequency,
    scalesValues: {
      y:[
        {
          name: "y",
          min: items.high.min,
          max: items.high.max,
          ticks: {
            callback: function (value) {
              return value + " " + items.high.unit;
            },
          },
        },
        {
          name: "y1",
          min: items.high.min,
          max: items.high.max,
          display: false,
        },
        {
          name: "y2",
          min: items.high.min,
          max: items.high.max,
          display: false,
        },
        {
          name: "y3",
          min: items.high.min,
          max: items.high.max,
          display: false,
        },
      ]
    }
  }
  
  const graphChartGas = { ...default_config }
  const graphChartGasSettings = {
    tension: 0.2,
    frequency: graphfrequency,
    scalesValues: {
      y: [
        {
          name: "y",
          min: items.oxi.min,
          max: items.oxi.max,
          ticks: {
            callback: function (value) {
              return value + " " + items.oxi.unit;
            },
          },
        },
        {
          name: "y1",
          min: items.red.min,
          max: items.red.max,
          display: false,
        },
        {
          name: "y2",
          min: items.oxi.min,
          max: items.oxi.max,
          display: false,
        },
      ]
    }
  }
  
  const graphChartPm = { ...default_config }
  const graphChartPmSettings = {
    tension: 0.2,
    frequency: graphfrequency,
    scalesValues: {
      y:[
        {
          name: "y",
          min: items.pm10.min,
          max: items.pm10.max,
          ticks: {
            callback: function (value) {
              return value + " " + items.pm100.unit;
            },
          },
        },
        {
          name: "y1",
          min: items.pm100.min,
          max: items.pm100.max,
          display: false,
        },
        {
          name: "y2",
          min: items.pm25.min,
          max: items.pm25.max,
          display: false,
        },
      ]
    }
  }

  //graph temperature
  const tempSets = [items.temp]
  graphChartTemp.data.datasets = datasetBuilder(tempSets, data.temp)
  graphChartTemp.options = optionsBuilder(ctxTemp, graphChartTempSettings)

  //graph humidity
  const humiSets = [items.humi]
  graphChartHumi.data.datasets = datasetBuilder(humiSets, data.humi)
  graphChartHumi.options = optionsBuilder(ctxHumi, graphChartHumiSettings)

  //graph pressure
  const presSets = [items.pres]
  graphChartPres.data.datasets = datasetBuilder(presSets, data.pres)
  graphChartPres.options = optionsBuilder(ctxPres, graphChartPresSettings)

  //graph lux
  const luxSets = [items.lux]
  graphChartLux.data.datasets = datasetBuilder(luxSets, data.lux)
  graphChartLux.options = optionsBuilder(ctxLux, graphChartLuxSettings)

  //graph noise
  const noiseSets = [items.low, items.amp, items.mid, items.high]
  graphChartNoise.data.datasets = datasetBuilder(noiseSets, data)
  graphChartNoise.options = optionsBuilder(ctxNoise, graphChartNoiseSettings)

  //graph gas
  const gasSets = [items.nh3, items.red, items.oxi]
  graphChartGas.data.datasets = datasetBuilder(gasSets, data)
  graphChartGas.options = optionsBuilder(ctxGas, graphChartGasSettings)

  //pm graph
  const pmSets = [items.pm10, items.pm25, items.pm100]
  graphChartPm.data.datasets = datasetBuilder(pmSets, data)
  graphChartPm.options = optionsBuilder(ctxPm, graphChartPmSettings)

  // creating charts from chart.js
  graphChartTempInput = new Chart(ctxTemp, graphChartTemp)
  graphChartHumiInput = new Chart(ctxHumi, graphChartHumi)
  graphChartPresInput = new Chart(ctxPres, graphChartPres)
  graphChartLuxInput = new Chart(ctxLux, graphChartLux)
  graphChartNoiseInput = new Chart(ctxNoise, graphChartNoise)
  graphChartGasInput = new Chart(ctxGas, graphChartGas)
  graphChartPmInput = new Chart(ctxPm, graphChartPm)
}

// Call a function repetitively with 1 second interval
setInterval(() => {
  /* getData(); */
  /* getGraph(); */
}, 5000); // ~1s update rate

getGraph()
/* window.addEventListener("resize", () => {
  destroyAllCharts();
  drawGraph(transformedData);
}); */