import Formatter from "./formatter"
import TooltipController from "./tooltip"
import { ResizeManager } from "./WindowManager"
import * as default_config from "./config"
import { date_gap_analyzer, find_best_format } from "./utils"

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

/**
* @param options object that contains key:value options
*    to control the look and behaviour of the chart
* @returns LineChart Object where you can load data etc.
**/
export function LineChart(options) {
    /*
    options: {
        id: "#mychart" (id of the newly created chart)
        container: "#my-ontainer", (id of the element where the chart should be created in) .
        color: "red", (color of the chart like: blue/rgb(0,0,0)/#000000) 
        x: "date", (key that is used to filter data for x axis)
        y: "y", (key that is used to filter data for y axis)
        timeFormat: "%Y-%m-%d %H:%M:%S", (date format of date, used to parse the date strings)
    }
    */

    const container = document.querySelector(options.container)
    if (!container) {
        console.error(
            "wetterchart.LineChart: could not find container '"+
            options.container+"'"
        )
        return new Error(
            "wetterchart.LineChart: could not find container '"+
            options.container+"'"
        )
    }

    let config = {
        ...options,
        width: container.offsetWidth,
        height: container.offsetHeight,
        styles: default_config.DEFAULT_STYLES,
        margin: default_config.DEFAULT_MARGINS,
        responsive: true,
    }
    
    const margin = config.margin
    const spinner = Spinner(config.container)
    const { formatEntrys, formatEntry } = Formatter(config.timeFormat)
    
    ResizeManager.addFunction(resize)
    
    let tooltip, x, y, data
    let width = calcWidth()
    let height = calcHeight()

    /* SVG CHART ELEMENT */
    let svg = d3.select(container)
        .append("svg")
        .attr("class", "dashboard__graph")
        .attr("opacity", "0")
        .attr("style", "transition:0.3s;")
        .attr("width", config.width) 
        .attr("height", config.height)
        .attr("id", config.id)

    svg.append("defs").html(`
        <pattern id="chart-no-data-pattern" patternUnits="userSpaceOnUse" width="30" height="30">
            <path d="M30,0 L0,30" stroke="#D0D0D0" stroke-width="1" />
        </pattern>
    `)
        
    function hide() {
        svg.attr("opacity", "0")
    }

    function show() {
        svg.attr("opacity", "1")
    }

    let graph_group = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)

    /* let brush = d3.brushX()
    .extent([[margin.left, margin.top], [config.width-config.margin.right+1, config.height-config.margin.bottom+1]])
    .on("end", function({selection}){
        console.log(selection)
    }); */
    let brush

    function NewBrush() {
        return d3.brushX()
        .extent([[margin.left, margin.top], [config.width-config.margin.right+1, config.height-config.margin.bottom+1]])
        .on("end", function({selection}){
            console.log(selection)
        });
    }

    /* let brush = svg.append("g")
        .attr("id", "graph-brush")
        .call(NewBrush()) */

    /* GRADIENT */
    if (config.area) {
        config.gradient_id = `gradient-graph-${config.y}`
        const gradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", config.gradient_id)
            .attr("x1", "0%")
            .attr("x2", "0%")
            .attr("y1", "0%")
            .attr("y2", "100%")
            .attr("spreadMethod", "pad")
    
        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", config.color)
            .attr("stop-opacity", 1)
    
        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", config.color)
            .attr("stop-opacity", 0)
    }

    /*  ADDING AXIS */
    /* X AXIS */
    const x_axis = graph_group.append("g")
        .attr("class", "linechart__x-axis unselectable")
        .style("font-size", "13px")
        .attr("transform", `translate(0, ${height})`)
        
        /* Y AXIS */
        const y_axis = graph_group.append("g")
        .attr("class", "linechart__y-axis unselectable")
        .style("font-size", "13px")
        .attr("transform", `translate(${width}, 0)`)

    function updateGraph(duration, options) {

        let x_axis_ticks
        let x_axis_time_format
        
        if (options && options.timeFormat ) {
            x_axis_time_format = options.timeFormat
            config.axis.x.timeFormat = options.timeFormat
        } else {
            x_axis_time_format = config.axis.x.timeFormat
        }
        
        if (options && options.ticks) {
            x_axis_ticks = options.ticks
            config.axis.x.ticks = options.ticks
        } else {
            x_axis_ticks = config.axis.x.ticks
        }

        x = get_x_scale(data)
        y = get_y_scale(data, config.y[0])

        // create the x axis:
        x_axis.transition().duration(duration).call(
            d3.axisBottom(x)
            .tickValues(x.ticks(x_axis_ticks))
            .tickFormat(x_axis_time_format)
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

        let y_values
        if (!Array.isArray(config.y)) {
            y_values = [config.y]
        } else {
            y_values = config.y
        }

        y_values.forEach((y, idx) => {
            if (config.gaps && config.gaps.length > 0) {
                let last_gap_end = 0
                
                config.gaps.forEach((gap, idx_gap) => {
                    draw_line(graph_group, data.slice(last_gap_end, gap[0]+1), ".graph__line"+idx.toString()+idx_gap.toString(), y, {
                        strokeWidth: config.styles.line.strokeWidth,
                        color: config.color[idx],
                        duration: duration
                    })
                    if (config.area) {
                        draw_area(graph_group,
                            data.slice(last_gap_end, gap[0]+1),
                            `.graph__area${idx}${idx_gap}`, y,
                            {duration: duration}
                        )
                    }

                    last_gap_end = gap[1]
                })

                draw_line(graph_group, data.slice(last_gap_end, data.length), ".graph__line"+ idx.toString(), y, {
                    strokeWidth: config.styles.line.strokeWidth,
                    color: config.color[idx],
                    duration: duration
                })

                if (config.area) {
                    draw_area(graph_group, data.slice(last_gap_end, data.length), ".graph__area"+idx, y, {duration: duration})
                }

            } else {
                draw_line(graph_group, data, ".graph__line"+ idx.toString(), y, {
                    strokeWidth: config.styles.line.strokeWidth,
                    color: config.color[idx],
                    duration: duration
                })

                if (config.area) {
                    draw_area(graph_group, data, ".graph__area"+idx, y, {duration: duration})
                }
            }
        });

        d3.selectAll(config.container+" .chart-no-data").remove()
        graph_group.append("g").selectAll(".chart-no-data")
            .data(config.gaps)
            .enter()
            .append("g")
            /* .html("<text fill='grey'>Keine Daten Vorhanden</text>") */
            .attr("class", "chart-no-data")
            .append("rect")
            .attr("width", d => {
                return x(data[d[1]].date) - x(data[d[0]].date)
            })
            .attr("x", d => {
                return x(data[d[0]].date)
            })
            .attr("height", height)
            .attr("stroke", "grey")
            .attr("stroke-width", "1px")
            .attr("fill", "url(#chart-no-data-pattern)")

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

        //tooltip.disable()
    }
    /* ADDING AREA PATH */

    function draw_area(container, area_data, classname, y, options) {
        let area = container.selectAll(classname)
        .data([area_data], d => d.date)
        area.enter()
            .append("path")
            .attr("class", classname.replace(".", ""))
            .merge(area)
            .style("pointer-events", "none")
            .style("opacity", 0)
            .transition()
            .duration(options.duration)
            .attr("d", getArea(y))
            .style("opacity", 1)
            .style("fill", `url(#${config.gradient_id})`)
    }

    function draw_line(container, line_data, classname, y, options) {
        //console.log("LineChart.line_data:", line_data)
        console.log(classname)
        let line = container.selectAll(classname).data([line_data])
        line.enter()
            .append("path")
            .attr("class", classname.replace(".", ""))
            .merge(line)
            .transition()
            .duration(options.duration)
            .attr("d", getLine(y))
            .attr("fill", "none")
            .attr("stroke", options.color)
            .attr("stroke-width", options.strokeWidth)
    }

    /* LINE */
    function getLine(y_value) {
        return d3.line(
            d => {
                return x(d[config.x])
            },
            d => {
                return y(d[y_value])
            }
        )//.curve(d3.curveCardinal.tension(0.5))//.curve(d3.curveBumpX)/* .curve(d3.curveCatmullRom.alpha(0.5)); */
    }
    
    /* AREA */
    function getArea(y_value) {
        return d3.area()
            .x(d => x(d[config.x]))
            .y0(height)
            .y1(d => y(d[y_value]))
    }
    
    function get_y_scale(data, y_value) {
        return d3.scaleLinear()
            .range([height, 0])
            .domain(config.axis.y.domain(data, y_value))
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
        y = get_y_scale(data, config.y[0])

        // transform axis
        x_axis.attr("transform", `translate(0, ${height})`)
        y_axis.attr("transform", `translate(${width}, 0)`)

        updateGraph(500)

        if (brush) {
            brush.node().remove()
            brush = svg.append("g")
                .call(NewBrush())
        }

        adjust_x_labels()
    }
    
    function adjust_x_labels() {
        // rotate labels when to narrow
        if (
            width < 600 &&
            config.period != "1m"
        ) {
            d3.selectAll(`.linechart__x-axis .tick text`)
            .style("transform", "translateY(10px) translateX(-10px) rotate(-60deg)")
        } else {
            d3.selectAll(`.linechart__x-axis .tick text`)
            .style("transform", "none")
        }
    }

    function calcWidth() { return config.width - config.margin.left - config.margin.right }
    function calcHeight() { return config.height - config.margin.bottom - config.margin.top }
    function addData(obj) { data.push(formatEntry(obj, ...config.y))}
    function shiftData() { data.shift() }
    function setData(arr) {
        data = formatEntrys(arr, ...config.y)
    }
    function load(new_data, options) {
        setData(new_data)
        if (options.gaps) {
            config.gaps = date_gap_analyzer(
                data, options.gaps.interval,
                options.gaps.gap_size
            )
        }

        const start_end = d3.extent(data, d => d.date)
        updateGraph(0, {...find_best_format(start_end[0], start_end[1])})
        adjust_x_labels()

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
        updateAxisFormat,

        show,
        hide
    }
}