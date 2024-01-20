function TooltipController(
    svg, container,
    width, height,
    config,
    data, x, y
) {
    /* ADDING TOOLTIP */
    const tooltip = d3.select(container)
        .append("div")
        .style("opacity", 0)
        .style("border-radius", "5px")
        .attr("class", "tooltip")

    const circle = svg.append("circle")
        .attr("class", "graph__circle")
        .style("fill", config.styles.dots)
        .attr("r", 5)
        .style("opacity", 0)
        .style("pointer-events", "none")

    svg.append("rect")
    .attr("class", "svg-listener-rect")
    .attr("width", width)
    .attr("height", height)
    .on("mousemove", function(e) {
        const {xPos,yPos,d} = calculatePosition(data, e, this)
        circle
            .attr("cx", xPos)
            .attr("cy", yPos)
            .style("opacity", 1)
            .style("transform", "scale(1)")
        tooltip
            .style("top", `${yPos - 16}px`)
            .style("left", `${xPos + config.margin.left}px`)
            .html(
                `
                <p>${d.entry_date.toLocaleString("de-DE").split(",")[0]}</p>
                <p>${d[config.y]+config.y_unit}</p>
                `
            )
            .transition()
            .duration(100)
            .style("opacity", 1)
            .style("transform", "scale(1)")
    })
    .on("mouseleave", () => {
        tooltip
            .transition()
            .duration(100)
            .style("opacity", 0)
            .style("transform", "scale(0)")
            
        circle
            .style("opacity", 0)
            .style("transform", "scale(0)")
    })

    function calculatePosition(data, e, rect) {
        const [xCoord] = d3.pointer(e, rect)
        const x0 = x.invert(xCoord)
        const bisectDate = d3.bisector(d => d[config.x]).left
        const i = bisectDate(data, x0, 1)
        const d0 = data[i - 1]
        const d1 = data[i]
        const d = x0 - d0[config.x] > d1[config.x] - x0 ? d1 : d0
        const xPos = x(d[config.x])
        const yPos = y(d[config.y])
        return {xPos, yPos, d}
    }
}

function Formatter() {
    function formatEntrys(entrys, ...args) {
        const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S")
        return entrys.map(entry => {
            const formatedObj = {}
            formatedObj.entry_date = parseDate(entry["entry_date"])
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

function formatData(entrys, config) {
    const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S")
    return entrys.map(entry => {
        const formatedObj = {}
        formatedObj[config.x] = parseDate(entry[config.x])
        formatedObj[config.y] = entry[config.y]
        
        return formatedObj
    });
}
function formatEntry(entry, config) {
    const parseDate = d3.timeParse("%Y-%m-%d")
    return {
        entry_date: parseDate(entry[config.x]),
        temp: entry.temp
    }
}

// calculates the average temp, humi and lux level
// of the given month
function average_one_month(data) {
    const ENTRY_AMOUNT = data.length
    let new_entry = { ...data[0] }
    data.forEach((entry, index) => {
        new_entry.humi += entry.humi
        new_entry.lux += entry.lux
        new_entry.temp += entry.temp

    })
    new_entry.humi = Math.round(new_entry.humi / ENTRY_AMOUNT)
    new_entry.lux = Math.round(new_entry.lux / ENTRY_AMOUNT)
    new_entry.temp = Math.round(new_entry.temp / ENTRY_AMOUNT)
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
    data = data.map(entry => {
        return {
            entry_date: entry.entry_date,
            humi: entry.humi,
            lux: entry.lux,
            temp: entry.temp
        }
    })

    // gets the start and end index of each month
    // in the array of entrys
    const month_index = {}
    let current_month = null
    data.forEach((entry, index) => {
        const month = entry.entry_date.split("-")[1]
        if (index === 0) current_month = month
        
        if (!Object.keys(month_index).includes(month))
            month_index[month] = {start: index}
        if (
            current_month != month ||
            index === data.length - 1
        )
            month_index[current_month].end = index-1

        current_month = month
    })

    const sorted_months = {}
    const allMonths = Object.keys(month_index).sort()
    allMonths.forEach((month, index) => {
        sorted_months[month] = data.slice(
            month_index[month].start,
            month_index[month].end + 1
        )
        if (index === allMonths.length -1) {
            sorted_months[month].push(data[data.length-1])
        }
    })
    const compressed_year = allMonths.map(month => {
        return average_one_month(sorted_months[month])
    })
    console.log(compressed_year)
    return compressed_year
}

/* 
-----------------------------------------
-----------------------------------------
-----------------------------------------
-----------------------------------------
-----------------------------------------
-----------------------------------------
-----------------------------------------
-----------------------------------------
*/

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
    const gradient = svg.append("defs")
    .append("linearGradient")
        .attr("id", "gradient")
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
    .style("fill", "url(#gradient)")
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

d3.json("wetter.json")
    .then(json => json.data)
    .then(data => {
        LineChart(
            {   
                margin: {
                    top: 40,
                    right: 60,
                    bottom: 40,
                    left: 30
                },
                axis: {
                    x: { class: "x-axis" },
                    y: { class: "y-axis" }
                },
                y: "temp",
                x: "entry_date",
                entrys: compress_one_year(data),
                id: "svg-graph",
                container: "#container",
                timeRange: "1y",
                width: 600,
                height: 400,
                axisFormat: {
                    x: {
                        ticks: d3.timeMonth.every(1),
                        timeFormat: d3.timeFormat("%b"),
                    },
                    y: {
                        tickFormat: d => isNaN(d) ? "":`${d}`+"°C",
                        ticks: 6,
                        domain: (data, y) => {
                            let min = d3.min(data, d => d[y])
                            let max = d3.max(data, d => d[y])
                            
                            let start = min >= 0 ? 0 : min -10
                            let end = (Math.round(max / 10) * 10) + 10
                            return [start, end]
                        }
                    }
                },
                styles: {
                    color: "#ff8080",
                    dots: "#f00", //#ff0000
                    axis: {
                        color: "white",
                    },
                    fontSize: "14px",
                    line: { strokeWidth: "3px" },
                    area: { opacity: 0.5 },
                },
                y_unit: "°C"
            }
        )
    })