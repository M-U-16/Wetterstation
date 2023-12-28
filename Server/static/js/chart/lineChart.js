const formatData = (entrys, config) => {
    const parseDate = d3.timeParse("%Y-%m-%d")
    return entrys.map(entry => {
        const formatedObj = {}
        formatedObj[config.x] = parseDate(entry[config.x])
        formatedObj[config.y] = entry[config.y]
        return formatedObj
    });
}
const formatEntry = (entry, config) => {
    const parseDate = d3.timeParse("%Y-%m-%d")
    return {
        entry_date: parseDate(entry[config.x]),
        temp: entry.temp
    }
}
// set default locale
d3.formatDefaultLocale({
    "decimal": ",",
    "thousands": ".",
    "grouping": [3],
    "currency": ["", "\u00a0€"]
})
// set default time locale
d3.timeFormatDefaultLocale({
    "dateTime": "%A, der %e. %B %Y, %X",
    "date": "%d.%m.%Y",
    "time": "%H:%M:%S",
    "periods": ["AM", "PM"],
    "days": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
    "shortDays": ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    "months": ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    "shortMonths": ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
})
let formatMillisecond = d3.timeFormat(".%L")
let formatSecond = d3.timeFormat(":%S")
let formatMinute = d3.timeFormat("%I:%M")
let formatHour = d3.timeFormat("%I %p")
let formatDay = d3.timeFormat("%a %d")
let formatWeek = d3.timeFormat("%b %d")
let formatMonth = d3.timeFormat("%B")
let formatYear = d3.timeFormat("%Y")
function tickFormat (date) {
    function multiFormat (date) {
        return (
            d3.timeSecond(date) < date ? formatMillisecond
            : d3.timeMinute(date) < date ? formatSecond
            : d3.timeHour(date) < date ? formatMinute
            : d3.timeDay(date) < date ? formatHour
            : d3.timeMonth(date) < date ? (timeWeek(date) < date ? formatDay : formatWeek)
            : d3.timeYear(date) < date ? formatMonth
            : formatYear
        )(date);
    }
    return multiFormat(date);
}


const LineChart = (initial_config) => {

    const calcWidth = () => conf.width - conf.margin.left - conf.margin.right
    const calcHeight = () => conf.height - conf.margin.bottom - conf.margin.top
    const clearChart = () => svg.selectAll("*").remove()
    const set_x_scale = () => d3.scaleTime().range([0, width]).domain(d3.extent(data, d => d[conf.x]))
    const set_y_scale = () => d3.scaleLinear().range([height, 0]).domain([d3.min(data, d => d[conf.y]), d3.max(data, d => d[conf.y])])
    
    const conf = initial_config
    const margin = conf.margin

    const data = formatData(conf.entrys, conf)
    const addData = (obj) => data.unshift(obj)
    
    let svg
    let width = calcWidth()
    let height = calcHeight()
    let x_axis, y_axis
    let line, area

    let x = set_x_scale()
    let y = set_y_scale()

    /* SVG ELEMENT */
    const addSvg = () => {
        svg = d3.select(conf.container)
        .append("svg")
        .attr("class", ".dashboard__graph")
        .attr("width", conf.width) 
        .attr("height", conf.height)
        .attr("id", "d3-svg-graph")
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
    }
    /* LINE */
    const getLine = () => {
        return d3.line()
            .x(d => x(d[conf.x]))
            .y(d => y(d[conf.y]))
    }
    /* AREA */
    const getArea = () => {
        return d3.area()
            .x(d => x(d[conf.x]))
            .y0(height)
            .y1(d => y(d[conf.y]))
    }
    /* FUNCTION FOR ADDING AXIS */
    const addAxis = () => {
        /* X AXIS */
        x_axis = svg.append("g")
            .attr("class", "linechart__x-axis")
            .style("font-size", "13px")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x)
                .tickValues(x.ticks(conf.axisFormat.x.ticks))
                .tickFormat(conf.axisFormat.x.timeFormat)
            )
            .selectAll(".tick line")
            .style("stroke-opacity", 1)

        /* Y AXIS */
        y_axis = svg.append("g")
            .attr("class", "linechart__y-axis")
            .style("font-size", "13px")
            .attr("transform", `translate(${width}, 0)`)
            .call(d3.axisRight(y)
                .ticks(conf.axisFormat.y.ticks)
                .tickFormat(conf.axisFormat.y.tickFormat)
            )
            .selectAll(".tick text")
            .style("fill", "#777")
    }
    /* FUNCTION FOR ADDING LINE PATH */
    const addLine = () => {
        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", conf.styles.color)
            .attr("stroke-width", conf.styles.line.strokeWidth)
            .attr("d", getLine())
    }
    /* FUNCTION FOR ADDING AREA PATH */
    const addArea = () => {
        svg.append("path")
            .datum(data)
            .style("fill", conf.styles.color)
            .style("opacity", conf.styles.area.opacity)
            .attr("d", getArea())
    }
    /* FUNCTION FOR ADDING DOTS */
    const addDots = () => {
        svg.selectAll("allCircles")
            .data(data)
            .join(
                (enter) => {
                    return enter.append("circle")
                        .style("opacity", 1)
                },
                (update) => {
                    return update.style("opacity", 1)
                }
            )
            .attr("fill", conf.styles.dots)
            .attr("cx", (d) => x(d[conf.x]))
            .attr("cy", (d) => y(d[conf.y]))
            .attr("r", 3)
    }
    const addGrid = (selection) => {
        selection.selectAll("x-grid")
            .data(x.ticks().slice(1))
            .join("line")
            .attr("x1", d => x(d))
            .attr("x2", d => x(d))
            .attr("y1", 0)
            .attr("y2", height)
            .attr("stroke", "#e0e0e0")
            .attr("stroke-width", 0.5)
            
        selection.selectAll("y-grid")
            .data(y.ticks().slice(1))
            .join("line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", d => y(d))
            .attr("y2", d => y(d))
            .attr("stroke", "#e0e0e0")
            .attr("stroke-width", 0.5)
            
    }
    const drawChart = () => {
        y =  set_y_scale()
        x = set_x_scale()

        addAxis() // draws x and y axis
        addGrid(svg)
        addLine() // draws graph
        addArea() // draws area under the graph
        addDots() // adds dots to every data entry
    }
    const update = () => {
        clearChart()
        drawChart()
    }
    const resize = () => {
        const container = document
            .querySelector(conf.container)
        conf.width = container.offsetWidth
        conf.height = container.offsetHeight
        width = calcWidth()
        height = calcHeight()
        update()
    }
    const init = () => { addSvg() }
    return {
        clearChart,
        drawChart,
        addDots,
        update,
        resize,
        init,
        svg,
    }
}