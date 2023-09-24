const default_config = {
    type: "line",
    data: {
        datasets: [

        ]
    },
    options: {},
}
let graphfrequency = "month"
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
    temp: itemBuilder("temp", "Temperature", "°C", "style.getPropertyValue('--color-red')", 0, 50),
    humi: itemBuilder("humi", "Humidity", "%", "style.getPropertyValue('--color-blue')", 0, 100),
    pres: itemBuilder("pres", "Pressure", "hPa", "style.getPropertyValue('--color-green')", 950, 150),
    lux: itemBuilder("lux", "Light", "lux", "style.getPropertyValue('--color-yellow')", 0, 25000),
    high: itemBuilder("high", "High", "u", "style.getPropertyValue('--color-noise-high')", 0, 300),
    mid: itemBuilder("mid", "Mid", "u", "style.getPropertyValue('--color-noise-mid')", 0, 300),
    low: itemBuilder("low", "Low", "u", "style.getPropertyValue('--color-noise-low')", 0, 300),
    amp: itemBuilder("amp", "Amp", "u", "style.getPropertyValue('--color-noise-amp')", 0, 300),
}
const items_gas = {
    nh3: itemBuilder("nh3", "NH3", "kΩ", "style.getPropertyValue('--color-olive')", 0, 600),
    oxi: itemBuilder("oxi", "Oxidising", "kΩ", "style.getPropertyValue('--color-violet')", 0, 1000),
    red: itemBuilder("red", "Reducing", "kΩ", "style.getPropertyValue('--color-turquoise')", 0, 400)
}
const items_pm = {
    pm10: itemBuilder("pm10", "PM10.0", "μg/m3", "style.getPropertyValue('--color-dust10')", 0, 800),
    pm25: itemBuilder("pm25", "PM2.5", "μg/m3", "style.getPropertyValue('--color-dust25')", 0, 800),
    pm100: itemBuilder("pm100", "PM100", "μg/m3", "style.getPropertyValue('--color-dust100')", 0, 800)
}
/*  */
let items = { ...items_ngp, ...items_gas, ...items_pm }
/*  */

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
            /* context.classList.remove("loading-spinner"); */
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
    /*  */
    const graphChartTempInput = { ...default_config }
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
    const tempSets = [items.temp]
    graphChartTempInput.data.datasets = datasetBuilder(tempSets, data)
    graphChartTempInput.options = optionsBuilder("ctxTemp", graphChartTempSettings)
    /*  */
    const graphChartHumiInput = { ...default_config }
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
    const humiSets = [items.humi]
    graphChartHumiInput.data.datasets = datasetBuilder(humiSets, data)
    graphChartHumiInput.options = optionsBuilder("ctxHumi", graphChartHumiSettings)
    /*  */
    const graphChartPresInput = { ...default_config }
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
    const presSets = [items.pres]
    graphChartPresInput.data.datasets = datasetBuilder(presSets, data)
    graphChartPresInput.options = optionsBuilder("ctxPres", graphChartPresSettings)
    /*  */
    const graphChartLuxInput = { ...default_config }
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
    const luxSets = [items.lux]
    graphChartLuxInput.data.datasets = datasetBuilder(luxSets, data)
    graphChartLuxInput.options = optionsBuilder("ctxLux", graphChartLuxSettings)
    /*  */
    const graphChartNoiseInput = { ...default_config }
    const graphChartNoiseSettings = {
        tension: 0.1,
        frequency: graphfrequency,
        scalesValues: {
            y: [
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
    const noiseSets = [items.low, items.amp, items.mid, items.high]
    graphChartNoiseInput.data.datasets = datasetBuilder(noiseSets, data)
    graphChartNoiseInput.options = optionsBuilder("ctxNoise", graphChartNoiseSettings)
    /*  */
    const graphChartGasInput = { ...default_config }
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
    const gasSets = [items.nh3, items.red, items.oxi]
    graphChartGasInput.data.datasets = datasetBuilder(gasSets, data)
    graphChartGasInput.options = optionsBuilder("ctxGas", graphChartGasSettings)
    /*  */
    const graphChartPmInput = { ...default_config }
    const graphChartPmSettings = {
        tension: 0.2,
        frequency: graphfrequency,
        scalesValues: {
            y: [
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
    const pmSets = [items.pm10, items.pm25, items.pm100]
    graphChartPmInput.data.datasets = datasetBuilder(pmSets, data)
    graphChartPmInput.options = optionsBuilder("ctxPm", graphChartPmSettings)
    /*  */
}