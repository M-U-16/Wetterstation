import {Formatter} from "./formatter"
import TooltipController from "./tooltip"
import { ResizeManager } from "./WindowManager"
import * as default_config from "./config"
import { date_gap_analyzer, find_best_format } from "./utils"
import { Spinner } from "./spinner"
import { AddChartGradient, AdjustXLabels, CalculateHeight, CalculateWidth, CreateSVG, CreateXAxis, CreateYAxis, DrawGridlines, GetScaleY, GetTimeScaleX } from "./chart"

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
    
    let tooltip, x, y, data, brush
    let width = CalculateWidth(config.width, margin)
    let height = CalculateHeight(config.height, margin)

    const {svg, show, hide} = CreateSVG(config.container, width, height, config.id)
    let chart_group = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`)

    /* function NewBrush() {
        return d3.brushX()
        .extent([[margin.left, margin.top], [config.width-config.margin.right+1, config.height-config.margin.bottom+1]])
        .on("end", function({selection}){
            console.log(selection)
        });
    } */

    /* let brush = svg.append("g")
        .attr("id", "chart-brush")
        .call(NewBrush()) */

    /* GRADIENT */
    if (config.area && config.gradient) {
        if (Array.isArray(config.y)) {
            if (!Array.isArray(config.color)) {
                return new Error("wetterchart.LineChart: color values must be given as array")
            }
            
            if (config.y.length != config.color.length) {
                return new Error("wetterchart.LineChart: not enough colors for y values of chart '"+config.id+"'")
            }

            config.y.forEach((y_value, idx) => {
                AddChartGradient(svg, config.color[idx], y_value)
            })
        } else {
            AddChartGradient(svg, config.color, config.y)
        }
    }

    /*  ADDING AXIS */
    /* X AXIS */
    const x_axis = CreateXAxis(chart_group, height)
    /* Y AXIS */
    const y_axis = CreateYAxis(chart_group, width)

    function updateChart(duration, options) {

        let x_axis_ticks
        let x_axis_time_format
        
        if (options && options.timeFormat ) {
            x_axis_time_format = options.timeFormat
        } else {
            x_axis_time_format = config.axis.x.timeFormat
        }
        
        if (options && options.ticks) {
            x_axis_ticks = options.ticks
        } else {
            x_axis_ticks = config.axis.x.ticks
        }

        x = GetTimeScaleX(data, width, config.x)
        y = GetScaleY(data, height, config.axis.y.domain, config.y[0])

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

        AdjustXLabels(chart_group, width)
        DrawGridlines(chart_group, width, height, x, y)

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
                    draw_line(chart_group, data.slice(last_gap_end, gap[0]+1), "chart__line"+idx.toString()+idx_gap.toString(), y, {
                        strokeWidth: config.styles.line.strokeWidth,
                        color: config.color[idx],
                        duration: duration
                    })
                    if (config.area) {
                        draw_area(chart_group,
                            data.slice(last_gap_end, gap[0]+1),
                            `chart__area${idx}${idx_gap}`, y,
                            {duration: duration, gradient: config.gradient}
                        )
                    }

                    last_gap_end = gap[1]
                })

                draw_line(chart_group, data.slice(last_gap_end, data.length), "chart__line"+ idx.toString(), y, {
                    strokeWidth: config.styles.line.strokeWidth,
                    color: config.color[idx],
                    duration: duration
                })

                if (config.area) {
                    draw_area(chart_group,
                        data.slice(last_gap_end, data.length),
                        "chart__area"+idx, y,
                        {duration: duration, gradient: config.gradient, color: config.color[idx]}
                    )
                }

            } else {
                draw_line(chart_group, data, "chart__line"+idx.toString(), y, {
                    strokeWidth: config.styles.line.strokeWidth,
                    color: config.color[idx],
                    duration: duration
                })

                if (config.area) {
                    draw_area(chart_group, data, "chart__area"+idx, y, {
                        duration: duration,
                        gradient: config.gradient,
                        color: config.color[idx]
                    })
                }
            }
        });

        chart_group.selectAll(".chart-no-data").remove()
        chart_group.selectAll(".chart-no-data").append("g")
            .data(config.gaps)
            .enter()
            .append("g")
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
                chart_group, width, height,config,
                data, x, y
            )
        } catch(err) {
            tooltip = TooltipController(
                chart_group, width, height,config,
                data, x, y
            )
        }
    }
    
    /* ADDING AREA PATH */
    function draw_area(container, area_data, classname, y, options) {
        let fill
        
        if (options) {
            if (options.gradient) {
                fill = `url(#chart-gradient-${y})`
            } else {
                fill = options.color
            }
        }
        
        let area = container.selectAll("."+classname).data([area_data], d => d.date)
        area.enter().append("path")
            .attr("class", classname)
            .merge(area)
            .style("pointer-events", "none")
            .style("opacity", 0)
            .transition()
            .duration(options.duration)
            .attr("d", getArea(y))
            .style("opacity", 1)
            .style("fill", fill)
    }

    function draw_line(container, line_data, classname, y, options) {
        //console.log("LineChart.line_data:", line_data)
        let line = container.selectAll("."+classname).data([line_data])
        line.enter().append("path")
            .attr("class", classname)
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
            d => { return x(d[config.x]) },
            d => { return y(d[y_value]) }
        )//.curve(d3.curveCardinal.tension(0.5))//.curve(d3.curveBumpX)/* .curve(d3.curveCatmullRom.alpha(0.5)); */
    }
    
    /* AREA */
    function getArea(y_value) {
        return d3.area()
            .x(d => x(d[config.x]))
            .y0(height)
            .y1(d => y(d[y_value]))
    }
    
    function resize() {
        //const container = document.querySelector(config.container)

        // get new dimensions from container
        config.width = container.offsetWidth
        config.height = container.offsetHeight

        // resize svg with margin
        width = CalculateWidth(config.width, margin)
        height = CalculateHeight(config.height, margin)

        // transform axis
        x_axis.attr("transform", `translate(0, ${height})`)
        y_axis.attr("transform", `translate(${width}, 0)`)

        updateChart(500)

        if (brush) {
            brush.node().remove()
            brush = svg.append("g").call(NewBrush())
        }
    }
    
    function addData(obj) { data.push(formatEntry(obj, ...config.y))}
    function shiftData() { data.shift() }
    function setData(arr) {
        data = formatEntrys(arr, ...config.y)
    }
    function load(new_data, options={}) {
        setData(new_data)
        if (options.gaps) {
            config.gaps = date_gap_analyzer(
                data, options.gaps.interval,
                options.gaps.gap_size
            )
        }
        console.log(data)

        const start_end = d3.extent(data, d => d.date)
        updateChart(0, {...find_best_format(start_end[0], start_end[1])})

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
        updateChart,
        updateConfig,
        updateAxisFormat,
        spinner,

        show,
        hide
    }
}