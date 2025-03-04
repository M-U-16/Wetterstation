const config = {
    default: {
        margin: {
            top: 30,
            right: 60,
            bottom: 40,
            left: 35
        },
        axis: {
            x: { class: "x-axis" },
            y: { class: "y-axis" }
        },
    },
    styles: {
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
    },
    units: {
        temp: "°C",
        humi: "%"
    },
    values: {
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
    },
    x_axis: {
        format: {
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
            },
            "1d": {
                x: {
                    ticks: d3.timeSecond.every(10),
                    timeFormat: d3.timeFormat("%H:%M:%S")
                }
            }
        }
    }
}

export function getAxisFormat(time, unit, y) {
    console.log(unit)
    
    const format = { ...config.x_axis.format[time] }
    format.y = {  ...config.values[y] }
    format.y.tickFormat = d => isNaN(d)?"":`${d}`+unit
    format.y.ticks = 6

    return format
}

export function GetConfig(options) {
    const container = document.querySelector(options.container_id)
    
    return {
        y: options.y,
        x: options.x,
        id: options.id,
        ...config.default,
        entrys: options.data,
        width: container.offsetWidth,
        y_unit: config.units[options.y],
        timeRange: options.timePeriod,
        height: container.offsetHeight,
        responsive: options.responsive,
        container: options.container_id,
        axisFormat: getAxisFormat(
            options.timePeriod,
            config.units[options.y],
            options.y
        ),
        styles: {
            ...config.styles.default,
            ...config.styles[options.y]
        } 
    }
}