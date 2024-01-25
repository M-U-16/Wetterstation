function LineChart(initial_config) {

    const config = initial_config
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

    function updateGraph() {
        x = get_x_scale(data)
        y = get_y_scale(data)

        // create the x axis:
        x_axis.transition()
        .duration(500)
        .call(
            d3.axisBottom(x)
            .tickValues(x.ticks(config.axisFormat.x.ticks))
            .tickFormat(config.axisFormat.x.timeFormat)
        )
            
        // create the y axis:
        y_axis.transition()
        .duration(500)
        .call(
            d3.axisRight(y)
            .ticks(config.axisFormat.y.ticks)
            .tickFormat(config.axisFormat.y.tickFormat)
        )

        /* GRID LINES */
        let grid_x_class = "grid-line-x-"+config.y
        let grid_y_class = "grid-line-y-"+config.y
        // remove all grid lines
        d3.selectAll(grid_x_class).remove()
        d3.selectAll(grid_y_class).remove()
        // append all x grid lines
        let grid_x = svg.selectAll(grid_x_class)
        .data(x.ticks())
        .enter()
            .append("line")
            .attr("class", `${grid_x_class} graph__grid-line`)
            .attr("x1", d => x(d))
            .attr("y1", 0)
            .attr("x2", d => x(d))
            .attr("y2", height)
        
        // append all y grid lines
        let grid_y = svg.selectAll(grid_y_class)
        .data(y.ticks())
        .enter()
            .append("line")
            .attr("class", `${grid_y_class} graph__grid-line`)
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
        .duration(500)
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
        .transition()
        .duration(500)
        .attr("d", getArea())
        .style("fill", `url(#${gradient_id})`)
        .style("opacity", 1)
        .style("pointer-events", "none")

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
    updateGraph()
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
    function calcWidth() { return config.width - config.margin.left - config.margin.right }
    function calcHeight() { return config.height - config.margin.bottom - config.margin.top }
    function addData(obj) { data.push(formatEntry(obj, "temp")) }
    function setData(arr) { data = formatData(arr, config) }

    return {
        addData,
        setData,
        updateGraph
    }
}