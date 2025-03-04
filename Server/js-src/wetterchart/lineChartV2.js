import Formatter from "./formatter"
import TooltipController from "./tooltip"
import { windowManager } from "./WindowManager"

export function LineChart(initial_config) {
    
    windowManager.addFunction(resize)

    let config = initial_config
    const margin = config.margin
    const { formatEntrys, formatEntry } = Formatter()
    
    let tooltip, x, y
    let data = formatEntrys(config.entrys, config.y)
    let width = calcWidth()
    let height = calcHeight()

    /* SVG ELEMENT */
    let svg = d3.select(config.container)
        .append("svg")
        .attr("class", "dashboard__graph")
        .attr("width", config.width) 
        .attr("height", config.height)
        .attr("id", config.id)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)

    /* GRADIENT */
    const gradient_id = `gradient-graph-${config.y}`
    const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", gradient_id)
        .attr("x1", "0%")
        .attr("x2", "0%")
        .attr("y1", "0%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad")

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", config.styles.color)
        .attr("stop-opacity", 1)

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", config.styles.color)
        .attr("stop-opacity", 0)

    /*  ADDING AXIS */
    /* X AXIS */
    const x_axis = svg.append("g")
        .attr("class", "linechart__x-axis")
        .style("font-size", "13px")
        .attr("transform", `translate(0, ${height})`)

    /* Y AXIS */
    const y_axis = svg.append("g")
        .attr("class", "linechart__y-axis")
        .style("font-size", "13px")
        .attr("transform", `translate(${width}, 0)`)
        
    updateGraph() // first load

    function updateGraph(duration) {

        x = get_x_scale(data)
        y = get_y_scale(data)

        // create the x axis:
        x_axis.transition()
        .duration(duration)
        .call(
            d3.axisBottom(x)
            .tickValues(x.ticks(config.axisFormat.x.ticks))
            .tickFormat(config.axisFormat.x.timeFormat)
        )
            
        // create the y axis:
        y_axis.transition()
        .duration(duration)
        .call(
            d3.axisRight(y)
            .ticks(config.axisFormat.y.ticks)
            .tickFormat(config.axisFormat.y.tickFormat)
        )

        /* GRID LINES */
        // remove all grid lines
        d3.selectAll(config.container + " .graph__grid-line" ).remove()
        // append all x grid lines
        svg.selectAll("graph__grid-line-x")
            .data(x.ticks())
            .enter()
            .append("line")
            .attr("class", "graph__grid-line-x graph__grid-line")
            .attr("x1", d => x(d))
            .attr("y1", 0)
            .attr("x2", d => x(d))
            .attr("y2", height)
        
        // append all y grid lines
        svg.selectAll("graph__grid-line-y")
            .data(y.ticks())
            .enter()
            .append("line")
            .attr("class", "graph__grid-line-y graph__grid-line")
            .attr("x1", 0)
            .attr("y1", d => y(d))
            .attr("x2", width)
            .attr("y2", d => y(d))

        let line = svg.selectAll(".graph__line")
            .data([data], (d) => d.entry_date)
        line.enter()
            .append("path")
            .attr("class", "graph__line")
            .merge(line)
            .transition()
            .duration(duration)
            .attr("d", getLine())
            .attr("fill", "none")
            .attr("stroke", config.styles.color)
            .attr("stroke-width", config.styles.line.strokeWidth)
        
        /* ADDING AREA PATH */
        let area = svg.selectAll(".graph__area")
            .data([data], d => d.entry_date)
        area.enter()
            .append("path")
            .attr("class", "graph__area")
            .merge(area)
            .style("fill", `url(#${gradient_id})`)
            .style("pointer-events", "none")
            .style("opacity", 0)
            .transition()
            .duration(duration)
            .attr("d", getArea())
            .style("opacity", 1)

        /* 
            UPDATE TOOLTIP
        */
        try {
            tooltip.remove()
            tooltip = TooltipController(
                svg, width, height,config,
                data, x, y
            )
        } catch(err) {
            tooltip = TooltipController(
                svg, width, height,config,
                data, x, y
            )
        }
    }
    /* LINE */
    function getLine() {
        return d3.line()
            .x(d => x(d[config.x]))
            .y(d => y(d[config.y]))
    }
    /* AREA */
    function getArea() {
        return d3.area()
            .x(d => x(d[config.x]))
            .y0(height)
            .y1(d => y(d[config.y]))
    }
    function get_y_scale(data) {
        return d3.scaleLinear()
            .range([height, 0])
            .domain(config.axisFormat.y.domain(data, config.y))
    }
    function get_x_scale(data) {
        return d3.scaleTime()
            .range([0, width])
            .domain(d3.extent(data, d => d[config.x]))
    }
    function resize() {
        const container = document.querySelector(config.container)
        // get new dimensions from container
        config.width = container.offsetWidth
        config.height = container.offsetHeight

        // resize svg with margin
        width = calcWidth()
        height = calcHeight()

        // calculate new scale
        x = get_x_scale(data)
        y = get_y_scale(data)

        // transform axis
        x_axis.attr("transform", `translate(0, ${height})`)
        y_axis.attr("transform", `translate(${width}, 0)`)

        updateGraph(500)

        // rotate labels when to narrow
        if (
            config.responsive &&
            width < 500 &&
            config.timeRange != "1m"
        ) {
            d3.selectAll(`.linechart__x-axis .tick text`)
            .style("transform", "translateY(10px) translateX(-20px) rotate(-60deg)")
        } else {
            d3.selectAll(`.linechart__x-axis .tick text`)
            .style("transform", "none")
        }
        
    }
    function calcWidth() { return config.width - config.margin.left - config.margin.right }
    function calcHeight() { return config.height - config.margin.bottom - config.margin.top }
    function addData(obj) {
        data.push(formatEntry(obj, config.y))
    }
    function shiftData() { data.shift() }
    function setData(arr) { data = formatEntrys(arr, config.y) }
    function updateConfig(time) { config.timeRange = time }
    function updateAxisFormat(newFormat) {
        config.axisFormat = {
            ...newFormat
        }
    }

    return {
        config,
        addData,
        setData,
        resize,
        shiftData,
        updateGraph,
        updateConfig,
        updateAxisFormat
    }
}