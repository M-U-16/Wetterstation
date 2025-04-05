export function CreateSVG(container, width, height, id) {
    let svg = d3.select(container)
        .append("svg")
        .attr("class", "dashboard__chart")
        .attr("opacity", "0")
        .attr("style", "transition:0.3s;")
        .attr("width", width) 
        .attr("height", height)
        .attr("id", id)

    svg.append("defs").html(`
        <pattern id="chart-no-data-pattern" patternUnits="userSpaceOnUse" width="30" height="30">
            <path d="M30,0 L0,30" stroke="#D0D0D0" stroke-width="1" />
        </pattern>
    `)

    function hide() {
        svg.attr("opacity", "0")
    }

    function show() {
        svg.attr("opacity", "1")
    }

    return {svg, hide, show}
}

export function DrawGridlines(group, width, height, x, y) {
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
        )
        
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
                    .attr("x2", width)    
            },
            exit => exit.remove()
        )
        
}

export function CalculateWidth(width, margin) { return width - margin.left - margin.right }
export function CalculateHeight(height, margin) { return height - margin.bottom - margin.top }

export function ParseOptions() {}

export function AddChartGradient(svg, color, y) {
    const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", `chart-gradient-${y}`)
        .attr("x1", "0%")
        .attr("x2", "0%")
        .attr("y1", "0%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad")

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", color)
        .attr("stop-opacity", 1)

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", color)
        .attr("stop-opacity", 0)
}

export function CreateXAxis(group, height) {
    const x_axis = group.append("g")
        .attr("class", "linechart__x-axis unselectable")
        .style("font-size", "13px")
        .attr("transform", `translate(0, ${height})`)
        
    return x_axis
}

export function GetTimeScaleX(data, width, x) {
    return d3.scaleTime()
        .range([0, width])
        .domain(d3.extent(data, d => d[x]))
}

// rotate labels when not enough space
export function AdjustXLabels(group, width) {
    if (width < 600) {
        group.selectAll(`.linechart__x-axis .tick text`)
            .style("transform", "translateY(10px) translateX(-10px) rotate(-60deg)")
    } else {
        group.selectAll(`.linechart__x-axis .tick text`).style("transform", "none")
    }
}

export function CreateYAxis(group, width) {
    const y_axis = group.append("g")
        .attr("class", "linechart__y-axis unselectable")
        .style("font-size", "13px")
        .attr("transform", `translate(${width}, 0)`)
    
    
    return y_axis
}

export function GetScaleY(data, height, domain, y) {
    return d3.scaleLinear()
        .range([height, 0])
        .domain(domain(data, y))
}