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
}
const styles_conf = {
    default: {
        fontSize: "14px",
        line: { strokeWidth: "3px" },
        area: { opacity: 0.5 },
    },
    temp: { 
        color: "#ff8080", // #df2f34
        dots: "#f00", //#ff0000
        axis: {
            color: "white",
        },
    },
    humi: {
        color: "#09bff7",
        dots: "#00f", //#09a4f7
        axis: {
            color: "grey",
        },
    }
}
const units_conf = {
    temp: "°C",
    humi: "%"
}
const value_config = {
    temp: {
        domain: (data, y) => {
            let min = d3.min(data, d => d[y])
            let max = d3.max(data, d => d[y])
            
            let start = min >= 0 ? 0 : min -10
            let end = (Math.round(max / 10) * 10) + 10
            return [start, end]
        }
    },
    humi: { domain: () => [0, 100] }
}
const X_AXIS_FORMATS = {
    "1m": {
        x: {
            ticks: d3.timeWeek.every(1),
            timeFormat: d3.timeFormat("%e %b")
        }
    },
    "1y": {
        x: {
            ticks: d3.timeMonth.every(1),
            timeFormat: d3.timeFormat("%b")
        }
    },
    "1w": {
        x: {
            ticks: d3.timeDay.every(1),
            timeFormat: d3.timeFormat("%a")
        }
    }
}
export function getAxisFormat(time, unit, y) {
    
    const format = { ...X_AXIS_FORMATS[time] }
    format.y = {  ...value_config[y] }
    format.y.tickFormat = d => isNaN(d)?"":`${d}`+unit
    format.y.ticks = 6

    return format
}

export function getConfig (
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
        axisFormat: getAxisFormat(timePeriod, units_conf[y], y),
        y_unit: units_conf[y],
        styles: {
            ...styles_conf.default,
            ...styles_conf[y]
        } 
    }
}