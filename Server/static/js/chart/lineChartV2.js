function LineChart(initial_config) {

    const { formatEntrys } = Formatter()
    const config = initial_config
    const margin = config.margin
    
    let data = formatEntrys(config.entrys, config.y)
    let width = calcWidth()
    let height = calcHeight()
    
    let x = set_x_scale()
    let y = set_y_scale()
    
    /* SVG ELEMENT */
    let svg = d3.select(config.container)
    .append("svg")
    .attr("class", "dashboard__graph")
    .attr("width", config.width) 
    .attr("height", config.height)
    .attr("id", config.id)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

    /* GRID LINES */
    svg.selectAll("x-grid")
    .data(x.ticks().slice(1))
    .join("line")
    .attr("class", "graph__grid-line")
    .attr("x1", d => x(d))
    .attr("x2", d => x(d))
    .attr("y1", 0)
    .attr("y2", height)
    
    svg.selectAll("y-grid")
    .data(y.ticks().slice(1))
    .join("line")
    .attr("class", "graph__grid-line")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", d => y(d))
    .attr("y2", d => y(d))

    /*  ADDING AXIS */
        /* X AXIS */
        svg.append("g")
        .attr("class", "linechart__x-axis")
        .style("font-size", "13px")
        .attr("transform", `translate(0, ${height})`)
        .call(
            d3.axisBottom(x)
            .tickValues(x.ticks(config.axisFormat.x.ticks))
            .tickFormat(config.axisFormat.x.timeFormat)
        )

        /* Y AXIS */
        svg.append("g")
        .attr("class", "linechart__y-axis")
        .style("font-size", "13px")
        .attr("transform", `translate(${width}, 0)`)
        .call(d3.axisRight(y)
            .ticks(config.axisFormat.y.ticks)
            .tickFormat(config.axisFormat.y.tickFormat)
        )
    
    
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
    
    /*  ADDING LINE PATH */
    svg.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", config.styles.color)
    .attr("stroke-width", config.styles.line.strokeWidth)
    .attr("d", getLine())

    /* ADDING AREA PATH */
    svg.append("path")
    .datum(data)
    .style("pointer-events", "none")
    .style("fill", `url(#${gradient_id})`)
    .style("opacity", 1)
    .attr("d", getArea())

    TooltipController(
        svg, config.container,
        width, height,config,
        data, x, y
    )
    
    /* LINE */
    function getLine() {
        return d3.line()
            .x(d => x(d[config.x]))
            .y(d => y(d[config.y]))
            /* .curve(d3.curveCatmullRom.alpha(0)); */
    }
    /* AREA */
    function getArea() {
        return d3.area()
            .x(d => x(d[config.x]))
            .y0(height)
            .y1(d => y(d[config.y]))
            /* .curve(d3.curveCatmullRom.alpha(0)); */
    }
    function set_y_scale() {
        return d3.scaleLinear()
            .range([height, 0])
            .domain(config.axisFormat.y.domain(data, config.y))
    }
    function set_x_scale() {
        return d3.scaleTime()
            .range([0, width])
            .domain(d3.extent(data, d => d[config.x]))
    }
    function calcWidth() { return config.width - config.margin.left - config.margin.right }
    function calcHeight() { return config.height - config.margin.bottom - config.margin.top }
    function addData(obj) { data.unshift(obj) }
    function setData(arr) { data = formatData(arr, config) }

    return {
        addData,
        setData
    }
}