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

function datasetBuilder(item, data) {
    const dataset = {}
    dataset.label = item.id
    dataset.data = data
    dataset.parsing = {
        yAxisKey: item.id
    }
    dataset.borderColor = item.color
    dataset.borderWidth = 2
    dataset.pointRadius = 1
    dataset.pointBackgroundColor = item.color

    return dataset
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
    graphChartTemp.data.datasets.push(datasetBuilder(items.temp, data))
    graphChartTemp.options = optionsBuilder("ctxTemp", graphChartTempSettings)
    /*  */
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
    graphChartHumi.data.datasets.push(datasetBuilder(items.humi, data))
    graphChartHumi.options = optionsBuilder("ctxHumi", graphChartHumiSettings)
    /*  */
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
    graphChartPres.data.datasets.push(datasetBuilder(items.pres, data))
    graphChartPres.options = optionsBuilder("ctxPres", graphChartPresSettings)
    /*  */
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
    graphChartLux.data.datasets.push(datasetBuilder(items.lux, data))
    graphChartLux.options = optionsBuilder("ctxLux", graphChartLuxSettings)
    /*  */
    const graphChartNoise = { ...default_config }
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
    graphChartNoise.data.datasets.push(datasetBuilder(items.noise, data))
    graphChartNoise.options = optionsBuilder("ctxNoise", graphChartNoiseSettings)
    /*  */
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
    graphChartGas.data.datasets.push(datasetBuilder(items.gas, data))
    graphChartGas.options = optionsBuilder("ctxGas", graphChartGasSettings)
    /*  */
    const graphChartPm = { ...default_config }
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
    graphChartPm.data.datasets.push(datasetBuilder(items.pm10, data))
    graphChartPm.data.datasets.push(datasetBuilder(items.pm25, data))
    graphChartPm.data.datasets.push(datasetBuilder(items.pm100, data))
    graphChartPm.options = optionsBuilder("ctxPm", graphChartPmSettings)
    /*  */

    console.log(graphChartTemp)
}

console.log(items)

drawGraph({
    test: "lol"
})