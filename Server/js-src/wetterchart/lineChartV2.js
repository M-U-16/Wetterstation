import Formatter from "./formatter"
import TooltipController from "./tooltip"
import { windowManager } from "./WindowManager"
import * as default_config from "./config"

function Spinner(container) {
    const spinner = d3.select(container)
        .append("div")
        .attr("class", "spinner")
        .html(`
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
            >
                <circle
                    r="40"
                    cx="50"
                    cy="50"
                    fill="none"
                    stroke="grey"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-dasharray="150 200"
                ></circle>
            </svg>
        `)
    show()

    function hide() {
        spinner.attr("class", "spinner hide")
    }

    function show() {
        spinner.attr("class", "spinner animate")
    }

    return {hide, show}
}

export function LineChart(initial_config) {
    const container = document.querySelector(initial_config.container)
    if (!container) {
        console.error(
            "wetterchart: LineChart could not find container '"+
            options.container+"'"
        )
        return new Error(
            "wetterchart: LineChart could not find container '"+
            options.container+"'"
        )
    }

    let config = {
        ...initial_config,
        width: container.offsetWidth,
        height: container.offsetHeight,
        styles: default_config.DEFAULT_STYLES,
        margin: default_config.DEFAULT_MARGINS,
        responsive: true,
    }

    const { formatEntrys, formatEntry } = Formatter(config.timeFormat)
    
    windowManager.addFunction(resize)
    const margin = config.margin
    
    let tooltip, x, y, data
    //let data = formatEntrys(config.data, config.y)
    let width = calcWidth()
    let height = calcHeight()

    const spinner = Spinner(config.container)

    /* SVG ELEMENT */
    let svg = d3.select(container)
        .append("svg")
        .attr("class", "dashboard__graph")
        .attr("style", "transition:0.3s;")
        .attr("width", config.width) 
        .attr("height", config.height)
        .attr("id", config.id)
    hide()

    function hide() {
        svg.attr("opacity", "0")
    }

    function show() {
        svg.attr("opacity", "1")
    }

    let graph_group = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)


    /* GRADIENT */
    /* const gradient_id = `gradient-graph-${config.y}`
    const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", gradient_id)
        .attr("x1", "0%")
        .attr("x2", "0%")
        .attr("y1", "0%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad") */

    /* gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", config.color)
        .attr("stop-opacity", 1)

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", config.color)
        .attr("stop-opacity", 0) */

    /*  ADDING AXIS */
    /* X AXIS */
    const x_axis = graph_group.append("g")
        .attr("class", "linechart__x-axis")
        .style("font-size", "13px")
        .attr("transform", `translate(0, ${height})`)

    /* Y AXIS */
    const y_axis = graph_group.append("g")
        .attr("class", "linechart__y-axis")
        .style("font-size", "13px")
        .attr("transform", `translate(${width}, 0)`)
        
    //updateGraph() // first load

    function updateGraph(duration) {

        x = get_x_scale(data)
        y = get_y_scale(data)

        // create the x axis:
        x_axis.transition().duration(duration).call(
            d3.axisBottom(x)
            .tickValues(x.ticks(config.axis.x.ticks))
            .tickFormat(config.axis.x.timeFormat)
        )
        
        // create the y axis:
        y_axis.transition().duration(duration).call(
            d3.axisRight(y)
            .ticks(config.axis.y.ticks)
            .tickFormat(config.axis.y.tickFormat(config.axis.y.unit))
        )
        
        /* GRID LINES */
        // remove all grid lines
        d3.selectAll(config.container + " .graph__grid-line" ).remove()

        // append all x grid lines
        graph_group.selectAll("graph__grid-line-x")
            .data(x.ticks())
            .enter()
            .append("line")
            .attr("class", "graph__grid-line-x graph__grid-line")
            .attr("x1", d => x(d))
            .attr("y1", 0)
            .attr("x2", d => x(d))
            .attr("y2", height)
        
        // append all y grid lines
        graph_group.selectAll("graph__grid-line-y")
            .data(y.ticks())
            .enter()
            .append("line")
            .attr("class", "graph__grid-line-y graph__grid-line")
            .attr("x1", 0)
            .attr("y1", d => y(d))
            .attr("x2", width)
            .attr("y2", d => y(d))

        console.log(getLine())
        let line = graph_group.selectAll(".graph__line")
            .data([data])
        line.enter()
            .append("path")
            .attr("class", "graph__line")
            .merge(line)
            .transition()
            .duration(duration)
            .attr("d", getLine())
            .attr("fill", "none")
            .attr("stroke", config.color)
            .attr("stroke-width", config.styles.line.strokeWidth)
        
        /* ADDING AREA PATH */
        //let area = svg.selectAll(".graph__area")
        //    .data([data], d => d.entry_date)
        //area.enter()
        //    .append("path")
        //    .attr("class", "graph__area")
        //    .merge(area)
        //    .style("pointer-events", "none")
        //    .style("opacity", 0)
        //    .transition()
        //    .duration(duration)
        //    .attr("d", getArea())
        //    .style("opacity", 1)
            //.style("fill", `url(#${gradient_id})`)

        /* UPDATE TOOLTIP */
        try {
            tooltip.remove()
            tooltip = TooltipController(
                graph_group, width, height,config,
                data, x, y
            )
        } catch(err) {
            tooltip = TooltipController(
                graph_group, width, height,config,
                data, x, y
            )
        }
    }

    /* LINE */
    function getLine() {
        return d3.line(
            d => x(d[config.x]),
            d => y(d[config.y])
        )
        .curve(d3.curveBundle)
        
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
            .domain(config.axis.y.domain(data, config.y))
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
            width < 500 &&
            config.period != "1m"
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
    function addData(obj) { data.push(formatEntry(obj, config.y))}
    function shiftData() { data.shift() }
    function setData(arr) {
        data = formatEntrys(arr, config.y)
    }
    function load(data) {
        setData(data)
        updateGraph()
        spinner.hide()
        show()
    }
    function updateConfig(time) { config.timeRange = time }
    function updateAxisFormat(newFormat) {config.axis = {...newFormat}}

    return {
        addData,
        load,
        setData,
        resize,
        shiftData,
        updateGraph,
        updateConfig,
        updateAxisFormat
    }
}