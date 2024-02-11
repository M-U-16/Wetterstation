const WeatherDiagramm = (initial_config) => {
    
    const {formatEntrys, formatEntry} = Formatter()
    const { margin } = { ...initial_config}
    const config = { ...initial_config}

    let svg
    let width = calcWidth(config.width, margin)
    let height = calcHeight(config.height, margin)

    const domains = {
        humi: () => [0, 100],
        temp: () => [
            d3.min(config.entrys, d => d["temp"]),
            d3.max(config.entrys, d => d["temp"])
        ],
    }
    function clearChart(chart) {
        chart.selectAll("*").remove()
    }
    function addData(obj) {
        return config.entrys.unshift(formatEntry(obj))
    }
    function setData(arr, args) {
        return config.entrys = formatEntrys(arr, args)
    }
    function calcWidth(width, margin){
        return width - margin.left - margin.right
    }
    function calcHeight(height, margin) {
        return height - margin.bottom - margin.top
    }
    function x_scale() {
        const month = d3.timeFormat("%b")
        return d3.scaleOrdinal()
        .domain(config.entrys.map(entry => {
            return month(entry.entry_date)
        }))
        .range([0, width])
    }
    function get_x_scale(x) {
        return d3.scaleTime()
            .rangeRound([0, width])
            .domain(d3.extent(config.entrys, d => d[x]))
            .nice()
    }
    function get_y_scale(domain) {
        return d3.scaleLinear()
            .range([height, 0])
            .domain(domain)
    }
    /* SVG ELEMENT */
    function addSvg(container, id) {
        svg = d3.select(container)
        .append("svg")
        .attr("class", "dashboard__graph")
        .attr("width", config.width)
        .attr("height", config.height)
        .attr("id", id)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
    }
    /* LINE */
    function getLine(entry_x, entry_y) {
        x = get_x_scale(entry_x)
        y = get_y_scale(domains[entry_y]())
        return d3.line()
            .x(d => x(d[entry_x]))
            .y(d => y(d[entry_y]))
    }
    /* AREA */
    function getArea(entry_x, entry_y) {
        return d3.area()
            .x(d => x(d[entry_x]))
            .y0(height)
            .y1(d => y(d[entry_y]))
    }
    /* FUNCTION FOR ADDING AXIS */
    function addAxis() {
        const x = x_scale()
        console.log(x)
        const y_temp = get_y_scale(domains.temp())
        const y_humi = get_y_scale(domains.humi())
        const unit_y1 = "°C", unit_y2 = "%";

        svg.append("g")
            .attr("class", "dashboard__main-graph-x")
            .style("font-size", "13px")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x))
            .selectAll(".tick text")
                .style("fill", "#777")
                
        svg.append("g")
            .attr("class", "dashboard__main-graph-y1")
            .style("font-size", "13px")
            .attr("transform", `translate(0, 0)`)
            .call(d3.axisLeft(y_temp)
                .ticks(7)
                .tickFormat(d => d + unit_y1)
            )
            .selectAll(".tick text")
                .style("fill", "#777")

        svg.append("g")
            .attr("class", "dashboard__main-graph-y2")
            .style("font-size", "13px")
            .attr("transform", `translate(${width}, 0)`)
            .call(d3.axisRight(y_humi)
                .ticks(7)
                .tickFormat(d => d + unit_y2)
            )
            .selectAll(".tick text")
                .style("fill", "#777")
        
    }
    /* FUNCTION FOR ADDING LINE PATH */
    function addLine(
        entry_x,
        entry_y,
        strokeColor,
        strokeWidth
    ) {
        svg.append("path")
            .datum(config.entrys)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", strokeColor)
            .attr("stroke-width", strokeWidth)
            .attr("d", 
                getLine(entry_x, entry_y)
            )
    }
    /* FUNCTION FOR ADDING AREA PATH */
    function addArea(x, y, fill, opacity) {
        svg.append("path")
            .datum(config.entrys)
            .style("fill", fill)
            .style("opacity", opacity)
            .attr("d", getArea(x, y))
    }
    function addBarRect(entry_x, entry_y) {
        const x = get_x_scale(entry_x)
        const y = get_y_scale(entry_y)

        // Add a rect for each bar.
        svg.append("g")
            .attr("fill", "lightblue")
            .selectAll()
            .data(config.entrys)
                .join("rect")
                .attr("x", d => x(d[entry_x]))
                .attr("y", d => y(d[entry_y]))
                .attr("class", d => d["entry_date"])
                .attr("height", d => {
                    return height - y(d[entry_y])
                })
                .attr("width", (width) / (config.entrys.length))
    }
    function update() { clearChart() }
    function resize() {
        const container = document.querySelector(config.container)
        config.width = container.offsetWidth
        config.height = container.offsetHeight
        width = calcWidth()
        height = calcHeight()
        update()
    }
    function init(
        container,
        id, entrys, ...args
    ) {
        addSvg(container, id)
        setData(entrys, args)
    }
    return {
        clearChart,
        addBarRect,
        get_x_scale,
        get_y_scale,
        height,
        width,
        addArea,
        addLine,
        setData,
        addData,
        addAxis,
        addSvg,
        update,
        resize,
        config,
        init,
        svg,
    }
}