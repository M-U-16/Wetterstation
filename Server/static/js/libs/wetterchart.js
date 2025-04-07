(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.wetterchart = {}));
})(this, (function (exports) { 'use strict';

    function Formatter(format="%Y-%m-%d %H:%M:%s") {
        const parseDate = d3.timeParse(format);
        
        function formatEntrys(entrys, ...args) {
            return entrys.map(entry => {
                const formatedObj = {};
                formatedObj.date = parseDate(entry["date"]);
                args.forEach(arg => formatedObj[arg] = entry[arg]);
                return formatedObj
            })
        }

        function formatEntry(entry, ...args) {
            const formatedEntry = {};
            formatedEntry.date = parseDate(entry.date);
            args.forEach(arg => formatedEntry[arg] = entry[arg]);
            return formatedEntry
        }
        
        return {
            formatEntrys,
            formatEntry
        }
    }

    function TooltipController(
        svg,
        width, height,
        config,
        data, x, y
    ) {
        const MARGIN_LEFT = config.margin.left;

        /* ADDING TOOLTIP */
        const tooltip = d3.select(config.container)
            .append("div")
            .style("opacity", 0)
            .attr("class", "chart-tooltip");

        const circle = svg.append("circle")
            .attr("class", "graph__circle")
            .style("fill", config.styles.dots)
            .attr("r", 5)
            .style("opacity", 0)
            .style("pointer-events", "none");

        const rect = svg.append("rect")
            .attr("class", "svg-listener-rect")
            .attr("width", width)
            .attr("height", height)
            .on("mousemove", handleMouseMove)
            .on("mouseleave", () => {
                tooltip.transition()
                    .duration(100)
                    .style("opacity", 0)
                    .style("transform", "scale(0)");
                circle.style("opacity", 0)
                    .style("transform", "scale(0)");
            });

        function handleMouseMove(event) {
            const {xPos,yPos,d} = calculatePosition(data, event, this);
            const tooltipWidth = tooltip.node().offsetWidth;
            const tooltipHeight = tooltip.node().offsetHeight;
            const rectWidth = this.width.animVal.value;

            let tool_pos_x = xPos+tooltipWidth <= rectWidth;
            let tool_pos_y = yPos-tooltipHeight >= 0;

            let offset_x = tool_pos_x? MARGIN_LEFT:MARGIN_LEFT-tooltipWidth;
            let offset_y = tool_pos_y? yPos:yPos+tooltipHeight;

            console.log(d);
            circle.attr("cx", xPos)
                .attr("cy", yPos)
                .style("opacity", 1)
                .style("transform", "scale(1)");
            tooltip.style("top", `${offset_y}px`)
                .style("left", `${xPos + offset_x}px`)
                .html(
                    `
                <p>${config.axis.x.tooltipFormat(d['date'])}</p>
                <p>${(d[config.y]).toString() + config.axis.y.unit}</p>
                `
                )
                .transition()
                .duration(100)
                .style("opacity", 1)
                .style("transform", "scale(1)");
        }

        function calculatePosition(data, e, rect) {
            const [xCoord] = d3.pointer(e, rect);
            const x0 = x.invert(xCoord);
            const bisectDate = d3.bisector(d => d[config.x]).left;
            const i = bisectDate(data, x0, 1);
            const d0 = data[i - 1];
            const d1 = data[i];
            const d = x0 - d0[config.x] > d1[config.x] - x0 ? d1 : d0;
            const xPos = x(d[config.x]);
            const yPos = y(d[config.y]);
            return {xPos, yPos, d}
        }

        function enable() {
            circle.attr("style", "display:static;");
            rect.attr("style", "pointer-events:all;");
        }
        
        function disable() {
            circle.attr("style", "display:none;");
            rect.attr("style", "pointer-events:none;");
        }

        function remove() {
            rect.remove();
            tooltip.remove();
            circle.remove();
        }
        
        return {
            remove,
            enable,
            disable
        }
    }

    function WindowResizeManager() {
        const functionStore = [];
        window.onresize = () => functionStore.forEach(func => func());

        function addFunction(func) {
            functionStore.push(func);
        }

        return {
            addFunction
        }
    }

    const ResizeManager = WindowResizeManager();

    const DEFAULT_MARGINS = { top: 10, right: 60, bottom: 40, left: 25};
    const DEFAULT_STYLES = {
        fontSize: "12px",
        line: { strokeWidth: "1.5px" },
        area: { opacity: 0.5 },
    };

    const DEFAULT_X_FORMAT_1M = {
        ticks: d3.timeWeek.every(1),
        timeFormat: d3.timeFormat("%e %b")
    };

    const DEFAULT_X_FORMAT_1Y = {
        ticks: d3.timeMonth.every(1),
        tooltipFormat: d3.timeFormat("%d.%m.%Y"),
        timeFormat: d3.timeFormat("%b")
    };

    const DEFAULT_X_FORMAT_1W = {
        ticks: d3.timeDay.every(1),
        timeFormat: d3.timeFormat("%a")
    };

    const DEFAULT_X_FORMAT_1D = {
        ticks: d3.timeHour.every(3),
        tooltipFormat: d3.timeFormat("%H:%S Uhr"),
        timeFormat: d3.timeFormat("%H")
    };

    const STYLES_FORMAT_1Y = {};

    const DEFAULT_TEMP_DOMAIN = (data, y) => {
        let min = d3.min(data, d => d[y]);
        let max = d3.max(data, d => d[y]);
        
        let start = min >= 0 ? 0 : min -10;
        let end = (Math.round(max / 10) * 10) + 10;
        return [start, end]
    };

    const DEFAULT_HUMI_DOMAIN = (data, y) => {
        let min = d3.min(data, d => d[y]);
        let max = d3.max(data, d => d[y]);

        let start, end;
        if (min <= 10) {
            start = 0;
        } else {
            start = min - 5;
        }

        if (max >= 80) {
            end = 100;
        } else {
            end = max + 5;
        }
        return [start, end]
    };

    const DEFAULT_PARTICLE_DOMAIN = (data) => {
        let max = d3.max(data, d => d["pm_100"]);
       /*  const max = d3.max(layers, function(layer) {
            return d3.max(layer, function(d) { return d[1]; });  // sum of stacked values
        }); */
        //let min = d3.min(data, d => d["pm_10"])
        return [0, max+5]
    };

    const DEFAULT_TEMP_COLOR = "#df2f34";
    const DEFAULT_HUMI_COLOR = "#0177c0";

    const TICK_FORMAT = function(unit) {
        return (d) => isNaN(d)?"":`${d}`+unit
    };

    let timelocale = d3.timeFormat;
    d3.format;

    function setDE() {
        // set default locale
        d3.formatDefaultLocale({
            "decimal": ",",
            "thousands": ".",
            "grouping": [3],
            "currency": ["", "\u00a0€"]
        });
        //d3.formatDefaultLocale(formatLocale)

        // set default time locale
        timelocale = d3.timeFormatLocale({
            "dateTime": "%A, der %e. %B %Y, %X",
            "date": "%d.%m.%Y",
            "time": "%H:%M:%S",
            "periods": ["AM", "PM"],
            "days": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
            "shortDays": ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
            "months": ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
            "shortMonths": ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
        });

        d3.timeFormat(".%L");
        d3.timeFormat(":%S");
        d3.timeFormat("%I:%M");
        d3.timeFormat("%I %p");
        d3.timeFormat("%a %d");
        d3.timeFormat("%b %d");
        d3.timeFormat("%B");
        d3.timeFormat("%Y");
    }

    /**
    @param data array of data points, each containing a date field with a javascript Date object
    @param interval period (in seconds) of the normal time interval in the data
    @param gap_size a number (1,2,3) saying how many intervals can be skipped before it counts as a gap, defaults to one

    This function looks if there are gaps (time gaps e.g. 2025-3-28 23:00:00,2025-4-14 01:00:00)
    in the given data and returns a two dimensional array containing the start and
    end index of the data points where a gap is.

    A gap is where the difference (in seconds) of the current date and the last
    date is greater than the given interval (also in seconds) * the gap size (integer number 1,2,3)

    For example:
    interval = 60*60 (one hour in seconds), gap_size=3

    We have this data (assuming the data is taken every hour): [
    0    {date: new Date("2025-3-28 23:00:00"), anydata: 1},
    1    {date: new Date("2025-3-29 00:00:00"), anydata: 2},
    2    {date: new Date("2025-3-29 01:00:00"), anydata: 3},
    3    {date: new Date("2025-3-29 01:00:00"), anydata: 4}, -> here is a gap
    4    {date: new Date("2025-4-14 00:00:00"), anydata: 5}, -> here is a gap
    5    {date: new Date("2025-4-14 01:00:00"), anydata: 6},
    6    {date: new Date("2025-4-14 02:00:00"), anydata: 7}, -> here is a gap
    7    {date: new Date("2025-4-14 06:00:00"), anydata: 8}, -> here is a gap
    7    {date: new Date("2025-4-14 09:00:00"), anydata: 9}, -> here is a gap, but difference is not greater 3*60*60
    ]

    And the function would return: [[3, 4], [6, 7]]
    [3,4] is the start and end index of the first gap in the data array
    [6,7] is the start and end index of the second gap in the data array
    **/
    function date_gap_analyzer(data=[], interval, gap_size=1) {
        if (data.length == 0) {
            return []
        }

        let last_date = null;
        let last_idx = 0;

        const gaps = [];
        data.forEach((entry, idx) => {
            if (!last_date) {
                last_date = entry.date;
                return
            }

            let time_diff = d3.timeSecond.count(last_date, entry.date);
            if ((time_diff/interval) > gap_size) {
                gaps.push([last_idx, idx]);
            }

            if (idx != data.length-1) {
                last_date = entry.date;
                last_idx = idx;
            }
        });

        return gaps
    }

    function find_best_format(start_date, end_date) {
        const daydiff = d3.timeDay.count(start_date, end_date);

        if (daydiff <= 1) { // data from one day
            const hourdiff = d3.timeHour.count(start_date, end_date);
            if (hourdiff <= 1) { // data from one hour or less
                return {
                    ticks: d3.timeMinute.every(10),
                    timeFormat: timelocale.format("%H:%M:%S")
                }
            }

            return {
                ticks: d3.timeHour.every(1),
                timeFormat: function(d) {
                    const hour = timelocale.format("%H")(d);
                    if (hour[0] == "0") {
                        return hour[1]
                    }
                    return  hour
                }
            }
        }

        if (daydiff < 3) {
            return {
                ticks: d3.timeDay.every(1),
                timeFormat: timelocale.format("%A")
            }
        } else if (daydiff < 7) {
            return {
                ticks: d3.timeDay.every(1),
                timeFormat: timelocale.format("%a")
            }
        }

        if (daydiff > 7 && daydiff < 21) {
            return {
                ticks: d3.timeDay.every(3),
                timeFormat: timelocale.format("%-d.%B")
            }
        }

        if (daydiff >= 21 && daydiff <= 31) { // data from close to one month
            return {
                ticks: d3.timeWeek.every(1),
                timeFormat: timelocale.format("%e %b")
            }
        }

        const monthdiff = d3.timeMonth.count(start_date, end_date);
        if (monthdiff < 3) {
            return {
                ticks: d3.timeMonth.every(1),
                timeFormat: timelocale.format("%-d.%B")
            }
        } else if (monthdiff <= 5) {
            return {
                ticks: d3.timeMonth.every(1),
                timeFormat: timelocale.format("%B")
            }
        } else if (monthdiff <= 12) {
            return {
                ticks: d3.timeMonth.every(1),
                timeFormat: timelocale.format("%b")
            }
        }

        if (monthdiff > 12) {
            console.log("diff > 12 months");
            return {
                ticks: d3.timeMonth.every(2),
                timeFormat: function(d) {
                    if (d.getMonth() === 0) {
                        return timelocale.format("%Y")(d)
                    } else {
                        return timelocale.format("%b")(d)
                    }
                }
            }
        }
    }

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
        `);
        show();

        function hide() {
            spinner.attr("class", "spinner hide");
        }

        function show() {
            spinner.attr("class", "spinner animate");
        }

        return {hide, show}
    }

    function CreateSVG(container, width, height, id) {
        let svg = d3.select(container)
            .append("svg")
            .attr("class", "dashboard__chart")
            .attr("opacity", "0")
            .attr("style", "transition:0.3s;")
            .attr("width", width) 
            .attr("height", height)
            .attr("id", id);

        svg.append("defs").html(`
        <pattern id="chart-no-data-pattern" patternUnits="userSpaceOnUse" width="30" height="30">
            <path d="M30,0 L0,30" stroke="#D0D0D0" stroke-width="1" />
        </pattern>
    `);

        function hide() {
            svg.attr("opacity", "0");
        }

        function show() {
            svg.attr("opacity", "1");
        }

        return {svg, hide, show}
    }

    function DrawGridlines(group, width, height, x, y) {
        /* GRID LINES */
        // remove all grid lines
        //group.selectAll(".chart__grid-line" ).remove()

        // append all x grid lines
        group.selectAll(".chart__grid-line-x")
            .data(x.ticks())
            .join(
                enter => {
                    return enter.append("line")
                    .attr("class", "chart__grid-line chart__grid-line-x")
                    .attr("x1", d => x(d))
                    .attr("y1", 0)
                    .attr("x2", d => x(d))
                    .attr("y2", height)
                },
                update => {
                    return update
                        .attr("x1", d => x(d))
                        .attr("x2", d => x(d))
                        .attr("y2", height)
                },
                exit => exit.remove()
            );
            
        // append all y grid lines
        group.selectAll(".chart__grid-line-y")
            .data(y.ticks())
            .join(
                enter => {
                    return enter.append("line")
                    .attr("class", "chart__grid-line chart__grid-line-y")
                    .attr("x1", 0)
                    .attr("y1", d => y(d))
                    .attr("x2", width)
                    .attr("y2", d => y(d))
                },
                update => {
                    update
                        .attr("y1", d => y(d)).attr("y2", d => y(d))
                        .attr("x2", width);    
                },
                exit => exit.remove()
            );
            
    }

    function CalculateWidth(width, margin) { return width - margin.left - margin.right }
    function CalculateHeight(height, margin) { return height - margin.bottom - margin.top }

    function AddChartGradient(svg, color, y) {
        const gradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", `chart-gradient-${y}`)
            .attr("x1", "0%")
            .attr("x2", "0%")
            .attr("y1", "0%")
            .attr("y2", "100%")
            .attr("spreadMethod", "pad");

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", color)
            .attr("stop-opacity", 1);

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", color)
            .attr("stop-opacity", 0);
    }

    function CreateXAxis(group, height) {
        const x_axis = group.append("g")
            .attr("class", "linechart__x-axis unselectable")
            .style("font-size", "13px")
            .attr("transform", `translate(0, ${height})`);
            
        return x_axis
    }

    function GetTimeScaleX(data, width, x) {
        return d3.scaleTime()
            .range([0, width])
            .domain(d3.extent(data, d => d[x]))
    }

    // rotate labels when not enough space
    function AdjustXLabels(group, width) {
        if (width < 600) {
            group.selectAll(`.linechart__x-axis .tick text`)
                .style("transform", "translateY(10px) translateX(-10px) rotate(-60deg)");
        } else {
            group.selectAll(`.linechart__x-axis .tick text`).style("transform", "none");
        }
    }

    function CreateYAxis(group, width) {
        const y_axis = group.append("g")
            .attr("class", "linechart__y-axis unselectable")
            .style("font-size", "13px")
            .attr("transform", `translate(${width}, 0)`);
        
        
        return y_axis
    }

    function GetScaleY(data, height, domain, y) {
        return d3.scaleLinear()
            .range([height, 0])
            .domain(domain(data, y))
    }

    /**
    * @param options object that contains key:value options
    *    to control the look and behaviour of the chart
    * @returns LineChart Object where you can load data etc.
    **/
    function LineChart(options) {
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

        const container = document.querySelector(options.container);
        if (!container) {
            console.error(
                "wetterchart.LineChart: could not find container '"+
                options.container+"'"
            );
            return new Error(
                "wetterchart.LineChart: could not find container '"+
                options.container+"'"
            )
        }

        let config = {
            ...options,
            width: container.offsetWidth,
            height: container.offsetHeight,
            styles: DEFAULT_STYLES,
            margin: DEFAULT_MARGINS,
            responsive: true,
        };
        
        const margin = config.margin;
        const spinner = Spinner(config.container);
        const { formatEntrys, formatEntry } = Formatter(config.timeFormat);
        
        ResizeManager.addFunction(resize);
        
        let tooltip, x, y, data;
        let width = CalculateWidth(config.width, margin);
        let height = CalculateHeight(config.height, margin);

        const {svg, show, hide} = CreateSVG(config.container, width, height, config.id);
        let chart_group = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

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
                    AddChartGradient(svg, config.color[idx], y_value);
                });
            } else {
                AddChartGradient(svg, config.color, config.y);
            }
        }

        /*  ADDING AXIS */
        /* X AXIS */
        const x_axis = CreateXAxis(chart_group, height);
        /* Y AXIS */
        const y_axis = CreateYAxis(chart_group, width);

        function updateChart(duration, options) {

            let x_axis_ticks;
            let x_axis_time_format;
            
            if (options && options.timeFormat ) {
                x_axis_time_format = options.timeFormat;
            } else {
                x_axis_time_format = config.axis.x.timeFormat;
            }
            
            if (options && options.ticks) {
                x_axis_ticks = options.ticks;
            } else {
                x_axis_ticks = config.axis.x.ticks;
            }

            x = GetTimeScaleX(data, width, config.x);
            y = GetScaleY(data, height, config.axis.y.domain, config.y[0]);

            // create the x axis:
            x_axis.transition().duration(duration).call(
                d3.axisBottom(x)
                .tickValues(x.ticks(x_axis_ticks))
                .tickFormat(x_axis_time_format)
            );
            
            // create the y axis:
            y_axis.transition().duration(duration).call(
                d3.axisRight(y)
                .ticks(config.axis.y.ticks)
                .tickFormat(config.axis.y.tickFormat(config.axis.y.unit))
            );

            AdjustXLabels(chart_group, width);
            DrawGridlines(chart_group, width, height, x, y);

            let y_values;
            if (!Array.isArray(config.y)) {
                y_values = [config.y];
            } else {
                y_values = config.y;
            }

            y_values.forEach((y, idx) => {
                if (config.gaps && config.gaps.length > 0) {
                    let last_gap_end = 0;
                    
                    config.gaps.forEach((gap, idx_gap) => {
                        draw_line(chart_group, data.slice(last_gap_end, gap[0]+1), "chart__line"+idx.toString()+idx_gap.toString(), y, {
                            strokeWidth: config.styles.line.strokeWidth,
                            color: config.color[idx],
                            duration: duration
                        });
                        if (config.area) {
                            draw_area(chart_group,
                                data.slice(last_gap_end, gap[0]+1),
                                `chart__area${idx}${idx_gap}`, y,
                                {duration: duration, gradient: config.gradient}
                            );
                        }

                        last_gap_end = gap[1];
                    });

                    draw_line(chart_group, data.slice(last_gap_end, data.length), "chart__line"+ idx.toString(), y, {
                        strokeWidth: config.styles.line.strokeWidth,
                        color: config.color[idx],
                        duration: duration
                    });

                    if (config.area) {
                        draw_area(chart_group,
                            data.slice(last_gap_end, data.length),
                            "chart__area"+idx, y,
                            {duration: duration, gradient: config.gradient, color: config.color[idx]}
                        );
                    }

                } else {
                    draw_line(chart_group, data, "chart__line"+idx.toString(), y, {
                        strokeWidth: config.styles.line.strokeWidth,
                        color: config.color[idx],
                        duration: duration
                    });

                    if (config.area) {
                        draw_area(chart_group, data, "chart__area"+idx, y, {
                            duration: duration,
                            gradient: config.gradient,
                            color: config.color[idx]
                        });
                    }
                }
            });

            chart_group.selectAll(".chart-no-data").remove();
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
                .attr("fill", "url(#chart-no-data-pattern)");

            /* UPDATE TOOLTIP */
            try {
                tooltip.remove();
                tooltip = TooltipController(
                    chart_group, width, height,config,
                    data, x, y
                );
            } catch(err) {
                tooltip = TooltipController(
                    chart_group, width, height,config,
                    data, x, y
                );
            }
        }
        
        /* ADDING AREA PATH */
        function draw_area(container, area_data, classname, y, options) {
            let fill;
            
            if (options) {
                if (options.gradient) {
                    fill = `url(#chart-gradient-${y})`;
                } else {
                    fill = options.color;
                }
            }
            
            let area = container.selectAll("."+classname).data([area_data], d => d.date);
            area.enter().append("path")
                .attr("class", classname)
                .merge(area)
                .style("pointer-events", "none")
                .style("opacity", 0)
                .transition()
                .duration(options.duration)
                .attr("d", getArea(y))
                .style("opacity", 1)
                .style("fill", fill);
        }

        function draw_line(container, line_data, classname, y, options) {
            //console.log("LineChart.line_data:", line_data)
            let line = container.selectAll("."+classname).data([line_data]);
            line.enter().append("path")
                .attr("class", classname)
                .merge(line)
                .transition()
                .duration(options.duration)
                .attr("d", getLine(y))
                .attr("fill", "none")
                .attr("stroke", options.color)
                .attr("stroke-width", options.strokeWidth);
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
            config.width = container.offsetWidth;
            config.height = container.offsetHeight;

            // resize svg with margin
            width = CalculateWidth(config.width, margin);
            height = CalculateHeight(config.height, margin);

            // transform axis
            x_axis.attr("transform", `translate(0, ${height})`);
            y_axis.attr("transform", `translate(${width}, 0)`);

            updateChart(500);
        }
        
        function addData(obj) { data.push(formatEntry(obj, ...config.y));}
        function shiftData() { data.shift(); }
        function setData(arr) {
            data = formatEntrys(arr, ...config.y);
        }
        function load(new_data, options={}) {
            setData(new_data);
            if (options.gaps) {
                config.gaps = date_gap_analyzer(
                    data, options.gaps.interval,
                    options.gaps.gap_size
                );
            }
            console.log(data);

            const start_end = d3.extent(data, d => d.date);
            updateChart(0, {...find_best_format(start_end[0], start_end[1])});

            spinner.hide();
            show();
        }
        function updateConfig(time) { config.timeRange = time; }
        function updateAxisFormat(newFormat) {config.axis = {...newFormat};}

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

    //import { Chart } from "./Chart"

    function StackedAreaChart(options) {

        const container = document.querySelector(options.container);
        if (!container) {
            console.error(
                "wetterchart.StackedChart: could not find container '"+
                options.container+"'"
            );
            return new Error(
                "wetterchart.StackedChart: could not find container '"+
                options.container+"'"
            )
        }

        let config = {
            ...options,
            width: container.offsetWidth,
            height: container.offsetHeight,
            styles: DEFAULT_STYLES,
            margin: DEFAULT_MARGINS,
            responsive: true,
        };
        
        const margin = config.margin;
        const spinner = Spinner(config.container);
        const { formatEntrys, formatEntry } = Formatter(config.timeFormat);

        ResizeManager.addFunction(resize);

        let data, x, y;
        // set the dimensions and margins of the graph
        let width = CalculateWidth(config.width, margin);
        let height = CalculateHeight(config.height, margin);
            
        /* SVG CHART ELEMENT */
        const {svg, hide, show} = CreateSVG(config.container, width, height);
        //show()

        let chart_group = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
        const keys = config.y;
        //chart_group.append("g").attr("transform", `translate(${width}, 0)`).call(d3.axisRight(y));

        /*  ADDING AXIS */
        /* X AXIS */
        const x_axis = CreateXAxis(chart_group, height);
        /* Y AXIS */
        const y_axis = CreateYAxis(chart_group, width);

        // color palette
        const color = d3.scaleOrdinal().domain(keys).range(config.color);
            
        function update(duration, options) {
            let x_axis_ticks;
            let x_axis_time_format;
                    
            if (options && options.timeFormat ) {
                x_axis_time_format = options.timeFormat;
                config.axis.x.timeFormat = options.timeFormat;
            } else {
                x_axis_time_format = config.axis.x.timeFormat;
            }
            
            if (options && options.ticks) {
                x_axis_ticks = options.ticks;
                config.axis.x.ticks = options.ticks;
            } else {
                x_axis_ticks = config.axis.x.ticks;
            }

            const stackedData = d3.stack().keys(keys)(data);
            console.log("stacked data:", stackedData);
            
            x = GetTimeScaleX(data, width, config.x);
            y = GetScaleY(stackedData, height, config.axis.y.domain, "pm_100");
            
            // create the x axis:
            x_axis.transition().duration(duration).call(
                d3.axisBottom(x)
                .tickValues(x.ticks(x_axis_ticks))
                .tickFormat(x_axis_time_format)
            );
                    
            // create the y axis:
            y_axis.transition().duration(duration).call(
                d3.axisRight(y)
                .ticks(config.axis.y.ticks)
                .tickFormat(config.axis.y.tickFormat(config.axis.y.unit))
            );

            AdjustXLabels(chart_group, width);
            DrawGridlines(chart_group, width, height, x, y);

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
            );
        }

        function resize() {
            // get new dimensions from container
            config.width = container.offsetWidth;
            config.height = container.offsetHeight;

            // resize svg with margin
            width = CalculateWidth(config.width, margin);
            height = CalculateHeight(config.height, margin);

            // transform axis
            x_axis.attr("transform", `translate(0, ${height})`);
            y_axis.attr("transform", `translate(${width}, 0)`);

            update(500);
        }

        function setData(arr) {
            data = formatEntrys(arr, ...config.y);
        }

        function load(new_data, options) {
            setData(new_data);
            if (options.gaps) {
                config.gaps = date_gap_analyzer(
                    data, options.gaps.interval,
                    options.gaps.gap_size
                );
            }
        
            const start_end = d3.extent(data, d => d.date);
            update(0, {...find_best_format(start_end[0], start_end[1])});
            spinner.hide();
            show();
        }

        return {
            load
        }
    }

    const config = {
        default: {
            margin: { top: 30, right: 60, bottom: 40, left: 35},
            axis: {x: { class: "x-axis" }, y: { class: "y-axis" }},
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
        units: {temp: "°C", humi: "%"},
        values: {
            temp: {
                domain: (data, y) => {
                    let min = d3.min(data, d => d[y]);
                    let max = d3.max(data, d => d[y]);
                    
                    let start = min >= 0 ? 0 : min -10;
                    let end = (Math.round(max / 10) * 10) + 10;
                    return [start, end]
                }
            },
            humi: { domain: () => [0, 100] }
        },
        x_axis: {
            format: {
                "1m": {x: {
                    ticks: d3.timeWeek.every(1),
                    timeFormat: d3.timeFormat("%e %b")
                }},
                "1y": {x: {
                    ticks: d3.timeMonth.every(1),
                    timeFormat: d3.timeFormat("%b")
                }},
                "1w": {x: {
                    ticks: d3.timeDay.every(1),
                    timeFormat: d3.timeFormat("%a")
                }},
                "1d": {x: {
                    ticks: d3.timeSecond.every(10),
                    timeFormat: d3.timeFormat("%H:%M:%S")
                }}
            }
        }
    };

    function GetYAxisFormat$1(time, unit, y) {
        const format = { ...config.x_axis.format[time] };
        format.y = {  ...config.values[y] };
        format.y.tickFormat = d => isNaN(d)?"":`${d}`+unit;
        format.y.ticks = 6;
        return format
    }

    function GetConfig(options) {
        
        return {
            y: options.y,
            x: options.x,
            id: options.id,
            ...config.default,
            entrys: options.data,
            y_unit: config.units[options.y],
            period: options.period,
            //width: container.offsetWidth,
            //height: container.offsetHeight,
            responsive: options.responsive,
            container: options.container,
            axisFormat: GetYAxisFormat$1(
                options.period,
                config.units[options.y],
                options.y
            ),
            styles: {
                ...config.styles.default,
                ...config.styles[options.y]
            } 
        }
    }

    // calculates the average temp, humi and lux level
    // of the given month
    function average_one_month(data) {
        const entry_amount = data.length;
        let new_entry = { ...data[0] };
        // sum all entries
        data.forEach((entry, index) => {
            new_entry.humi += entry.humi;
            new_entry.lux += entry.lux;
            new_entry.temp += entry.temp;
        });
        new_entry.humi = Math.round(new_entry.humi / entry_amount);
        new_entry.lux = Math.round(new_entry.lux / entry_amount);
        new_entry.temp = Math.round(new_entry.temp / entry_amount);
        return new_entry
    }

    // function for compressing
    // entry data of 1 year
    /*  
        compressed values:
            - humidity
            - temperature
            - light level
    */
    function compress_one_year(data) {
        if (!data) {
            console.error("No data provided to function");
            return
        }

        data = data.map(entry => {
            return {
                date: entry.date,
                humi: entry.humi,
                lux: entry.lux,
                temp: entry.temp
            }
        });

        // gets the start and end index of each month
        // in the array of entrys
        const month_index = {};
        let current_month = null;
        data.forEach((entry, index) => {
            const month = entry.date.split("-")[1];
            if (index === 0) current_month = month;
            
            if (!Object.keys(month_index).includes(month))
                month_index[month] = {start: index};
            if (
                current_month != month ||
                index === data.length - 1
            )
                month_index[current_month].end = index-1;

            current_month = month;
        });

        const sorted_months = {};
        const allMonths = Object.keys(month_index).sort();
        allMonths.forEach((month, index) => {
            sorted_months[month] = data.slice(
                month_index[month].start,
                month_index[month].end + 1
            );
            if (index === allMonths.length -1) {
                sorted_months[month].push(data[data.length-1]);
            }
        });

        const compressed_year = allMonths.map(month => {
            return average_one_month(sorted_months[month])
        }).sort((prev, now) => {
            if (prev.date < now.date) return -1
            if (prev.date > now.date) return 1
            return 0
        }); // sorted in ascending order

        return compressed_year
    }

    /*
    */
    function average_per_day(data=[], data_points=[]) {
        if (data.length == 0) {
            return []
        }

        if (data_points.length == 0) {
            return data
        }

        // array containing averaged data of the days
        let averaged_days = [];

        // use first value as starting date
        let day = new Date(data[0].date);
        let current_day;
        let current_entry = {
            count: 0,
            data: null
        };

        data.push(0);
        data.forEach(entry => {
            current_day = new Date(entry.date);

            if (current_day.getDate() != day.getDate() || entry == 0) {
                data_points.forEach(point => {
                    current_entry.data[point] = +(
                        current_entry.data[point] / current_entry.count
                    ).toFixed(2);
                });
                averaged_days.push(current_entry.data);
                current_entry.data = null;
                day = current_day;
            }
            
            if (!current_entry.data) {
                current_entry.count = 1;
                current_entry.data = entry;
                return
            }

            data_points.forEach(point => {
                current_entry.data[point] += entry[point];
            });

            current_entry.count++;
        });

        return averaged_days
    }

    async function updateGraphs(graphs, data, value) {
        graphs.forEach(graph => {
            graph.setData(data);
            graph.updateAxisFormat(
                GetYAxisFormat(value, graph.config.y_unit, graph.config.y)
            );
            graph.updateConfig(value);
            graph.updateGraph(0);
        });
    }

    async function FetchData(type, time) {
        return fetch(`/api/data?${type}=${time}`)
            .then(res => res.json())
            .then(res => res.data)
    }

    exports.DEFAULT_HUMI_COLOR = DEFAULT_HUMI_COLOR;
    exports.DEFAULT_HUMI_DOMAIN = DEFAULT_HUMI_DOMAIN;
    exports.DEFAULT_MARGINS = DEFAULT_MARGINS;
    exports.DEFAULT_PARTICLE_DOMAIN = DEFAULT_PARTICLE_DOMAIN;
    exports.DEFAULT_STYLES = DEFAULT_STYLES;
    exports.DEFAULT_TEMP_COLOR = DEFAULT_TEMP_COLOR;
    exports.DEFAULT_TEMP_DOMAIN = DEFAULT_TEMP_DOMAIN;
    exports.DEFAULT_X_FORMAT_1D = DEFAULT_X_FORMAT_1D;
    exports.DEFAULT_X_FORMAT_1M = DEFAULT_X_FORMAT_1M;
    exports.DEFAULT_X_FORMAT_1W = DEFAULT_X_FORMAT_1W;
    exports.DEFAULT_X_FORMAT_1Y = DEFAULT_X_FORMAT_1Y;
    exports.FetchData = FetchData;
    exports.GetConfig = GetConfig;
    exports.GetYAxisFormat = GetYAxisFormat$1;
    exports.LineChart = LineChart;
    exports.STYLES_FORMAT_1Y = STYLES_FORMAT_1Y;
    exports.StackedAreaChart = StackedAreaChart;
    exports.TICK_FORMAT = TICK_FORMAT;
    exports.average_per_day = average_per_day;
    exports.compress_one_year = compress_one_year;
    exports.date_gap_analyzer = date_gap_analyzer;
    exports.find_best_format = find_best_format;
    exports.setDE = setDE;
    exports.updateGraphs = updateGraphs;

}));
