const default_conf = {
    margin: {
        top: 40,
        right: 60,
        bottom: 50,
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
        area: { opacity: 0.1 },
    },
    temp: { 
        color: "#ff8080",
        dots: "#ff0000",
        axis: {
            color: "grey",
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
const timeRange_conf = {
    "1m": {
        x: {
            ticks: d3.timeWeek.every(1),
            timeFormat: d3.timeFormat("%d-%b-%Y")
        },
        y: {
            ticks: 5,
            tickFormat: d => isNaN(d) ? "" : `${d}`
        }
    },
    "1y": {
        x: {
            ticks: d3.timeMonth.every(1),
            timeFormat: d3.timeFormat("%b")
        },
        y: {
            ticks: 5,
            tickFormat: d => isNaN(d) ? "" : `${d}`
        }
    },
    "1w": {
        x: {
            ticks: d3.timeDay.every(1),
            timeFormat: d3.timeFormat("%a")
        },
        y: {
            ticks: 5,
            tickFormat: d => isNaN(d) ? "" : `${d}`
        }
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
    const config = { ...default_conf }
    config.y = y
    config.x = x
    config.id = id
    config.entrys = data
    config.container = container_id
    config.width = container.offsetWidth
    config.height = container.offsetHeight
    config.axisFormat = timeRange_conf[timePeriod]
    config.styles = {
        ...styles_conf.default,
        ...styles_conf[y]
    }
    return config
}