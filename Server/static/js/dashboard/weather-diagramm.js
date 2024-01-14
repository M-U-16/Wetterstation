const TooltipController = () => {
    const removeElements = (...funcs) => funcs.forEach(func => func())
    const updateTooltips = (x, y, ...funcs) => funcs.forEach(func => func(x,y))
    /* FUNCTION FOR ADDING TOOLTIPS */
    function getTooltip(container) {
        return d3.select(container)
            .append("div")
            .attr("class", "tooltip")
    }
    function getTooltipLine(svg, id) {
        return svg.append("line")
            .attr("class", "tooltip-line")
            .attr("id", id)
            .attr("stroke", "red")
            .attr("stroke-width", 3)
            .attr("stroke-dasharray", "2,2")
    }
    function getListeningRect(svg, width, height) {
        return svg.append("rect")
            .attr("class", "svg-rect")
            .attr("width", width)
            .attr("height", height)
    }
    function calculatePosition(data, e) {
        const [xCoord] = d3.pointer(e, this)
        const x0 = x.invert(xCoord)
        const bisectDate = d3.bisector(d => d[conf.x]).left
        const i = bisectDate(data, x0, 1)
        const d0 = data[i - 1]
        const d1 = data[i]
        const d = x0 - d0[conf.x] > d1[conf.x] - x0 ? d1 : d0
        const xPos = x(d[conf.x])
        const yPos = y(d[conf.y])

        return xPos, yPos, d
    }
    return {
        removeElements,
        getTooltip,
        updateTooltips,
        getTooltipLine,
        getListeningRect,
        calculatePosition
    }
}
const Formatter = () => {
    function formatEntrys(entrys, args) {
        const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S")
        return entrys.map(entry => {
            const formatedObj = {}
            formatedObj["entry_date"] = parseDate(entry["entry_date"])
            args.forEach(arg => formatedObj[arg] = entry[arg])
            return formatedObj
        })
    }
    function formatEntry(entry, ...args) {
        const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S")
        const formatedEntry = {}
        formatedObj.entry_date = parseDate(entry.entry_date)
        args.forEach(arg => formatedEntry[arg] = entry[arg])
        return formatedEntry
    }
    return {
        formatEntrys,
        formatEntry
    }
}
const WeatherDiagramm = (initial_config) => {
    const {formatEntrys, formatEntry} = Formatter()
    const config = { ...initial_config}
    const { margin } = { ...initial_config}

    let svg
    let width = calcWidth(config.width, margin)
    let height = calcHeight(config.height, margin)
    
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
    function minDate() {
        return d3.min(config.entrys, d => d.entry_date.getTime())
    }
    function maxDate() {
        return d3.max(config.entrys, d => d.entry_date.getTime())
    }
    /* function getPadding() {
        return (maxDate - minDate) * 0.1
    } */
    function get_padded_x_scale() {
        return d3.scaleOrdinal()
            .domain(config.entrys, d => d.entry_date)
            .range([0, width])
    }
    function get_x_scale(x) {
        return d3.scaleTime()
            .rangeRound([0, width])
            .domain(d3.extent(config.entrys, d => d[x]))
    }
    function get_y_scale(y) {
        return d3.scaleLinear()
            .range([height, 0])
            .domain([
                d3.min(config.entrys, d => d[y]),
                d3.max(config.entrys, d => d[y])
            ])
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
        y = get_y_scale(entry_y)
        return d3.line()
            .x(d => x(d[entry_x]))
            .y(d => y(d[entry_y]))
            .curve(d3.curveCatmullRom.alpha(0.5));
    }
    /* AREA */
    function getArea(entry_x, entry_y) {
        return d3.area()
            .x(d => x(d[entry_x]))
            .y0(height)
            .y1(d => y(d[entry_y]))
            .curve(d3.curveCatmullRom.alpha(0.5));
    }
    /* FUNCTION FOR ADDING AXIS */
    function addAxis() {
        const x = get_padded_x_scale()
        const y1 = get_y_scale("temp")
        const y2 = get_y_scale("humi")

        const unit_y1 = "°C", unit_y2 = "%";

        svg.append("g")
            .attr("class", "dashboard__main-graph-x")
            .style("font-size", "13px")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x)
                //.tickValues(x.ticks(d3.timeMonth.every(1)))
                .tickFormat(d3.timeFormat("%b"))
            )
            .selectAll(".tick text")
                .style("fill", "#777")
                
        svg.append("g")
            .attr("class", "dashboard__main-graph-y1")
            .style("font-size", "13px")
            .attr("transform", `translate(0, 0)`)
            .call(d3.axisLeft(y1)
                .ticks(7)
                .tickFormat(d => d + unit_y1)
            )
            .selectAll(".tick text")
                .style("fill", "#777")

        svg.append("g")
            .attr("class", "dashboard__main-graph-y2")
            .style("font-size", "13px")
            .attr("transform", `translate(${width}, 0)`)
            .call(d3.axisRight(y2)
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

        console.log()

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
                    console.log(d, height, y(d[entry_y]))

                    return height - y(d[entry_y])
                })
                .attr("width", (width) / (config.entrys.length))
                //.attr("width", width / config.entrys.length);
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