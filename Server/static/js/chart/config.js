const default_conf = {
    margin: {
        top: 40,
        right: 60,
        bottom: 40,
        left: 30
    },
    axis: {
        x: { class: "x-axis" },
        y: { class: "y-axis" }
    },
    line: {},
    area: {},
}
const styles_conf = {
    default: {
        fontSize: "14px",
        line: { strokeWidth: "3px" },
        area: { opacity: 0.5 },
    },
    temp: { 
        color: "#ff8080",
        dots: "#ff0000",
        axis: {
            color: "white",
        },
    },
    humi: {
        color: "#09bff7",
        dots: "#09a4f7",
        axis: {
            color: "grey",
        },
    }
}
const getTimeRange = (time, unit) => {
    console.log(unit)
    const range = { x: {}, y:{}}


    if (time === "1m") {
        range.x.ticks = d3.timeWeek.every(1)
        range.x.timeFormat = d3.timeFormat("%d %b %Y")
        range.y.tickFormat =  d => isNaN(d) ? "" : `${d}` + unit
        range.y.ticks = 6
        return range
    }
    if (time === "1y") {
        range.x.ticks = d3.timeMonth.every(1)
        range.x.timeFormat = d3.timeFormat("%b")
        range.y.tickFormat = d => isNaN(d) ? "" : `${d}` + unit
        range.y.ticks = 6
        return range
    }
    if (time === "1w") {
        range.x.ticks = d3.timeDay.every(1)
        range.x.timeFormat = d3.timeFormat("%a")
        range.y.tickFormat = d => isNaN(d) ? "" : `${d}` + unit
        range.y.ticks = 6
        return range
    }
}
const y_units_conf = {
    temp: "°C",
    humi: "%"
}

function getConfig (
    container_id,
    data,
    x, y,
    timePeriod,
    id
) {
    const container = document
        .querySelector(container_id)

    const config = { ...default_conf }

    config.y = y
    config.x = x
    config.id = id
    config.entrys = data
    config.container = container_id
    config.width = container.offsetWidth
    config.height = container.offsetHeight
    config.axisFormat = getTimeRange(timePeriod, y_units_conf[y])
    config.styles = {
        ...styles_conf.default,
        ...styles_conf[y]
    }

    console.log(config)
    return config
}