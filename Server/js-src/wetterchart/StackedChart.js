//import { Chart } from "./Chart"
import {
    AdjustXLabels,
    CalculateHeight,
    CalculateWidth,
    CreateSVG,
    CreateXAxis, CreateYAxis, DrawGridlines,
    GetScaleY,
    GetTimeScaleX
} from "./chart"
import * as default_config from "./config"
import { Formatter } from "./formatter"
import { timelocale } from "./local"
import { Spinner } from "./spinner"
import { date_gap_analyzer, find_best_format } from "./utils"
import { ResizeManager } from "./WindowManager"

export function StackedAreaChart(options) {

    const container = document.querySelector(options.container)
    if (!container) {
        console.error(
            "wetterchart.StackedChart: could not find container '"+
            options.container+"'"
        )
        return new Error(
            "wetterchart.StackedChart: could not find container '"+
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

    let data, x, y
    // set the dimensions and margins of the graph
    let width = CalculateWidth(config.width, margin)
    let height = CalculateHeight(config.height, margin)
        
    /* SVG CHART ELEMENT */
    const {svg, hide, show} = CreateSVG(config.container, width, height)
    //show()

    let chart_group = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`)
    const keys = config.y
    //chart_group.append("g").attr("transform", `translate(${width}, 0)`).call(d3.axisRight(y));

    /*  ADDING AXIS */
    /* X AXIS */
    const x_axis = CreateXAxis(chart_group, height)
    /* Y AXIS */
    const y_axis = CreateYAxis(chart_group, width)

    // color palette
    const color = d3.scaleOrdinal().domain(keys).range(config.color)
        
    function update(duration, options) {
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

        const stackedData = d3.stack().keys(keys)(data)
        console.log("stacked data:", stackedData)
        
        x = GetTimeScaleX(data, width, config.x)
        y = GetScaleY(stackedData, height, config.axis.y.domain, "pm_100")
        
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

        chart_group.selectAll(".stacked-chart-area")
        .data(stackedData)
        .enter()
        .append("path")
        .attr("class", ".stacked-chart-area")
        .style("stroke", function(d) {return color(d.key)})
        .style("stroke-width", "1px")
        .style("fill", function(d) { return color(d.key) })
        .style("fill-opacity", "0.3")
        .attr("d", d3.area()
            .x(function(d) { return x(d.data.date); })
            .y0(function(d) { return y(d[0]); })
            .y1(function(d) { return y(d[1]); })
        )
    }

    function resize() {
        // get new dimensions from container
        config.width = container.offsetWidth
        config.height = container.offsetHeight

        // resize svg with margin
        width = CalculateWidth(config.width, margin)
        height = CalculateHeight(config.height, margin)

        // transform axis
        x_axis.attr("transform", `translate(0, ${height})`)
        y_axis.attr("transform", `translate(${width}, 0)`)

        update(500)
    }

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
        update(0, {...find_best_format(start_end[0], start_end[1])})
        spinner.hide()
        show()
    }

    return {
        load
    }
}