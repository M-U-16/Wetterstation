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
const y_units_conf = {
    temp: "°C",
    humi: "%"
}
const value_config = {
    temp: {
        domain: (data, y) => {
            return [
                d3.min(data, d => d[y]),
                d3.max(data, d => d[y])
            ]
        }
    },
    humi: {
        domain: (...args) => [0, 100]
    }
}
function getAxisFormat(time, unit, y) {
    const range = { x: {}, y:{}}
    range.y.domain = value_config[y].domain

    if (time === "1m") {
        range.x.ticks = d3.timeWeek.every(1)
        range.x.timeFormat = d3.timeFormat("%e.%m.%Y")
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

function getConfig (
    container_id,
    data,
    x, y,
    timePeriod,
    id
) {
    const container = document
        .querySelector(container_id)

    return {
        ...default_conf,
        y: y,
        x: x,
        id: id,
        entrys: data,
        container: container_id,
        timeRange: timePeriod,
        width: container.offsetWidth,
        height: container.offsetHeight,
        axisFormat: {
            ...getAxisFormat(timePeriod, y_units_conf[y], y),
        },
        y_unit: y_units_conf[y],
        styles: {
            ...styles_conf.default,
            ...styles_conf[y]
        } 
    }
}