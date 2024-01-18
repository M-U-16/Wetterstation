const LineChart = (initial_config) => {
    
    const conf = initial_config
    const margin = conf.margin
    let data = formatData(conf.entrys, conf)
    let width = calcWidth()
    let height = calcHeight()
    
    let x = set_x_scale()
    let y = set_y_scale()
    let svg
    
    function calcWidth() { return conf.width - conf.margin.left - conf.margin.right }
    function calcHeight() { return conf.height - conf.margin.bottom - conf.margin.top }
    function clearChart() { svg.selectAll("*").remove() }
    function set_x_scale() {
        return d3.scaleTime()
            .range([0, width])
            .domain(d3.extent(data, d => d[conf.x]))
    }
    function set_y_scale() {
        return d3.scaleLinear()
            .range([height, 0])
            //.domain([d3.min(data, d => d[conf.y]), d3.max(data, d => d[conf.y])])
            .domain(conf.axisFormat.y.domain(data, conf.y))
    }
    function addData(obj) { data.unshift(obj) }
    function setData(arr) { data = formatData(arr, conf) }
    
    /* SVG ELEMENT */
    function addSvg() {
        svg = d3.select(conf.container)
        .append("svg")
        .attr("class", "dashboard__graph")
        .attr("width", conf.width) 
        .attr("height", conf.height)
        .attr("id", conf.id)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
    }
    /* LINE */
    function getLine() {
        return d3.line()
            .x(d => x(d[conf.x]))
            .y(d => y(d[conf.y]))
            /* .curve(d3.curveCatmullRom.alpha(0)); */
    }
    /* AREA */
    function getArea() {
        return d3.area()
            .x(d => x(d[conf.x]))
            .y0(height)
            .y1(d => y(d[conf.y]))
            /* .curve(d3.curveCatmullRom.alpha(0)); */
    }
    /* FUNCTION FOR ADDING AXIS */
    function addAxis() {
        /* X AXIS */
        svg.append("g")
            .attr("class", "linechart__x-axis")
            .style("font-size", "13px")
            .attr("transform", `translate(0, ${height})`)
            .call(
                d3.axisBottom(x)
                    .tickValues(x.ticks(conf.axisFormat.x.ticks))
                    .tickFormat(conf.axisFormat.x.timeFormat)
                
            )

        /* Y AXIS */
        svg.append("g")
            .attr("class", "linechart__y-axis")
            .style("font-size", "13px")
            .attr("transform", `translate(${width}, 0)`)
            .call(d3.axisRight(y)
                .ticks(conf.axisFormat.y.ticks)
                .tickFormat(conf.axisFormat.y.tickFormat)
            )
    }
    /* FUNCTION FOR ADDING LINE PATH */
    function addLine() {
        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", conf.styles.color)
            .attr("stroke-width", conf.styles.line.strokeWidth)
            .attr("d", getLine())
    }
    /* FUNCTION FOR ADDING AREA PATH */
    function addArea() {
        svg.append("path")
            .datum(data)
            .style("fill", conf.styles.color)
            .style("opacity", conf.styles.area.opacity)
            .attr("d", getArea())
    }
    /* FUNCTION FOR ADDING DOTS */
    function addDots() {
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
            .attr("r", 5)
    }
    function addGrid(selection) {
        selection.selectAll("x-grid")
            .data(x.ticks().slice(1))
            .join("line")
            .attr("class", "graph__grid-line")
            .attr("x1", d => x(d))
            .attr("x2", d => x(d))
            .attr("y1", 0)
            .attr("y2", height)
            /* .attr("stroke", "#fff")
            .attr("stroke-width", 1) */
            
        selection.selectAll("y-grid")
            .data(y.ticks().slice(1))
            .join("line")
            .attr("class", "graph__grid-line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", d => y(d))
            .attr("y2", d => y(d))
            /* .attr("stroke", "#fff")
            .attr("stroke-width", 0.5) */
            
    }
    /* INTERACTIVE ELEMENTS */
    function addTooltips() {
        /* TOOLTIPS */
        const tooltip = d3.select(conf.container)
            .append("div")
            .attr("class", "tooltip")
        
        const tooltipRawDate = d3.select(conf.container)
            .append("div")
            .attr("class", "tooltip")
        
        /* ADD CIRCLE ELEMENT */
        const circle = svg.append("circle")
            .attr("r", 0)
            .attr("fill", "red")
            .style("stroke", "transparent")
            .attr("opacity", 1)
            .style("pointer-events", "none")
        
        const tooltipLineX = svg.append("line")
            .attr("class", "tooltip-line")
            .attr("id", `tooltip-line-x-${conf.y}`)
            .attr("stroke", "red")
            .attr("stroke-width", 3)
            .attr("stroke-dasharray", "2,2")
            
        const tooltipLineY = svg.append("line")
            .attr("class", "tooltip-line")
            .attr("id", `tooltip-line-y-${conf.y}`)
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "2,2")

        const listeningRect = svg.append("rect")
            .attr("class", "svg-rect")
            .attr("width", width)
            .attr("height", height)
        	.on("mousemove", function (e) {
                console.log(this)
                const [xCoord] = d3.pointer(e, this)
                console.log(xCoord)
                const bisectDate = d3.bisector(d => d[conf.x]).left
                const x0 = x.invert(xCoord)
                const i = bisectDate(data, x0, 1)
                const d0 = data[i - 1]
                const d1 = data[i]
                const d = x0 - d0[conf.x] > d1[conf.x] - x0 ? d1 : d0
                const xPos = x(d[conf.x])
                const yPos = y(d[conf.y])
                const date = d[conf.x].toLocaleString("de-DE").split(",")[0]

                circle.attr("cx", xPos).attr("cy", yPos)
                circle.transition().duration(50).attr("r", 5)

                tooltipLineX.style("display", "block")
                    .attr("x1", xPos)
                    .attr("x2", xPos)
                    .attr("y1", 0)
                    .attr("y2", height)
                tooltipLineY.style("display", "block")
                    .attr("x1", 0)
                    .attr("x2", width)
                    .attr("y1", yPos)
                    .attr("y2", yPos)
                
                tooltip
                    .style("display", "block")
                    .style("left", `${width + margin.left}px`)
                    .style("top", `${yPos + margin.top - 15}px`)
                    .html(`${d[conf.y] !== undefined ? d[conf.y] + conf.y_unit : "N/A"}`)
                
                tooltipRawDate
                    .style("display", "block")
                    .style("left", `${xPos}px`)
                    .style("top", `${height + margin.top}px`)
                    .html(`${d[conf.x] !== undefined ? date: "N/A"}`)
            })
            .on("mouseleave", () => {
                circle.transition().duration(50).attr("r", 0)
                tooltipRawDate.style("display", "none")
                tooltip.style("display", "none")
                tooltipLineX.style("display", "none")
                tooltipLineY.style("display", "none")
                tooltipLineX.attr("x1", 0).attr("x2", 0);
                tooltipLineY.attr("y1", 0).attr("y2", 0);
            })
    }
    /* 
    ########################
    ------------------------
    ########################
    */
    function drawChart() {
        y =  set_y_scale()
        x = set_x_scale()

        addAxis() // draws x and y axis
        addGrid(svg)
        addLine() // draws graph
        addArea() // draws area under the graph
        addDots() // adds dots to every data entry

        addTooltips()
    }
    function update() {
        clearChart()
        drawChart()
    }
    function resize() {
        const container = document
            .querySelector(conf.container)
        conf.width = container.offsetWidth
        conf.height = container.offsetHeight
        width = calcWidth()
        height = calcHeight()
        update()
    }
    function init() { addSvg() }
    return {
        clearChart,
        drawChart,
        setData,
        addDots,
        update,
        resize,
        conf,
        init,
        svg,
    }
}