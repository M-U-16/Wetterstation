const TooltipController = () => {
    const removeElements = (...funcs) => funcs.forEach(func => func())
    const updateTooltips = (x, y, ...funcs) => funcs.forEach(func => func(x,y))
    /* FUNCTION FOR ADDING TOOLTIPS */
    const getTooltip = (container) => {
        return d3.select(container)
            .append("div")
            .attr("class", "tooltip")
    }
    const getTooltipLine = (svg, id) => {
        return svg.append("line")
            .attr("class", "tooltip-line")
            .attr("id", id)
            .attr("stroke", "red")
            .attr("stroke-width", 3)
            .attr("stroke-dasharray", "2,2")
    }
    const getListeningRect = (svg, width, height) => {
        return svg.append("rect")
            .attr("class", "svg-rect")
            .attr("width", width)
            .attr("height", height)
    }
    const calculatePosition = (data, e) => {
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

const WeatherDiagramm = (initial_config) => {
    const calcWidth = (width, margin) => width - margin.left - margin.right
    const calcHeight = (height, margin) => height - margin.bottom - margin.top
    const clearChart = (chart) => chart.selectAll("*").remove()
    const set_x_scale = (x) => d3.scaleTime().range([0, width]).domain(d3.extent(config.entrys, d => d[x]))
    const set_y_scale = (y) => d3.scaleLinear().range([height, 0]).domain([d3.min(config.entrys, d => d[y]), d3.max(config.entrys, d => d[y])])
    
    const config = { ...initial_config}
    const { margin } = { ...initial_config}
    console.log(config)
    
    let svg, line, area, x_axis, y_axis
    let width = calcWidth(config.width, margin)
    let height = calcHeight(config.height, margin)
    
    const addData = (obj) => config.entrys.unshift(config.formatEntry(obj))
    const setData = (arr) => { config.entrys = config.formatData(arr, conf) }
    
    /* SVG ELEMENT */
    const addSvg = (container, id) => {
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
    const getLine = (x, y) => {
        return d3.line()
            .x(d => x(d[x]))
            .y(d => y(d[y]))
            .curve(d3.curveCatmullRom.alpha(0.5));
    }
    /* AREA */
    const getArea = (x, y) => {
        return d3.area()
            .x(d => x(d[x]))
            .y0(height)
            .y1(d => y(d[y]))
            .curve(d3.curveCatmullRom.alpha(0.5));
    }
    /* FUNCTION FOR ADDING AXIS */
    const addAxis = (transform, call) => {
        svg.append("g")
            .attr("class", "linechart__x-axis")
            .style("font-size", "13px")
            .attr("transform", transform)
            .call(call)
            .selectAll(".tick text")
                .style("fill", "#777")
    }
    /* FUNCTION FOR ADDING LINE PATH */
    const addLine = (x, y, strokeColor, strokeWidth) => {
        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", strokeColor)
            .attr("stroke-width", strokeWidth)
            .attr("d", getLine(x, y))
    }
    /* FUNCTION FOR ADDING AREA PATH */
    const addArea = (x, y, fill, opacity) => {
        svg.append("path")
            .datum(config.entrys)
            .style("fill", fill)
            .style("opacity", opacity)
            .attr("d", getArea(x, y))
    }
    const update = () => {
        clearChart()
    }
    const resize = () => {
        const container = document.querySelector(config.container)
        config.width = container.offsetWidth
        config.height = container.offsetHeight
        width = calcWidth()
        height = calcHeight()
        update()
    }
    const init = () => {
        addSvg()
        setData(config)
    }
    return {
        clearChart,
        addData,
        addSvg,
        update,
        resize,
        config,
        init,
        svg,
    }
}