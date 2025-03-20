export const DEFAULT_MARGINS = { top: 10, right: 60, bottom: 40, left: 25}
export const DEFAULT_STYLES = {
    fontSize: "12px",
    line: { strokeWidth: "2px" },
    area: { opacity: 0.5 },
}

export const X_FORMAT_1M = {
    ticks: d3.timeWeek.every(1),
    timeFormat: d3.timeFormat("%e %b")
}
export const X_FORMAT_1Y = {
    ticks: d3.timeMonth.every(1),
    tooltipFormat: d3.timeFormat("%d.%m.%Y"),
    timeFormat: d3.timeFormat("%b")
}
export const X_FORMAT_1W = {
    ticks: d3.timeDay.every(1),
    timeFormat: d3.timeFormat("%a")
}
export const X_FORMAT_1D = {
    ticks: d3.timeHour.every(3),
    tooltipFormat: d3.timeFormat("%H:%S Uhr"),
    timeFormat: d3.timeFormat("%H")
}

export const STYLES_FORMAT_1Y = {}

export const DEFAULT_TEMP_DOMAIN = (data, y) => {
    let min = d3.min(data, d => d[y])
    let max = d3.max(data, d => d[y])
    
    let start = min >= 0 ? 0 : min -10
    let end = (Math.round(max / 10) * 10) + 10
    return [start, end]
}
export const DEFAULT_HUMI_DOMAIN = (data, y) => {
    let min = d3.min(data, d => d[y])
    let max = d3.max(data, d => d[y])

    let start, end
    if (min <= 10) {
        start = 0
    } else {
        start = min - 5
    }

    if (max >= 80) {
        end = 100
    } else {
        end = max + 5
    }
    return [start, end]
}

export const DEFAULT_TEMP_COLOR = "#df2f34"
export const DEFAULT_HUMI_COLOR = "#0177c0"

export const TICK_FORMAT = function(unit) {
    return (d) => isNaN(d)?"":`${d}`+unit
}