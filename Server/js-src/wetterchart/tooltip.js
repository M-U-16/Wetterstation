export default function TooltipController(
    svg,
    width, height,
    config,
    data, x, y
) {
    let line, circle

    const MARGIN_LEFT = config.margin.left

    /* ADDING TOOLTIP */
    const tooltip = d3.select(config.container)
        .append("div")
        .style("opacity", 0)
        .attr("class", "chart-tooltip")

        
        if (config.is_line) {
            line = svg.append("line")
                .attr("class", "graph-tooltip-line")
                .style("stroke", "black")
                .style("stroke-width", "1")
                .style("opacity", 0)
                .style("pointer-events", "none")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", 0)
                .attr("y2", height)
        } else {
            circle = svg.append("circle")
                .attr("class", "graph__circle")
                .style("fill", config.styles.dots)
                .attr("r", 5)
                .style("opacity", 0)
                .style("pointer-events", "none")
        }
        
    const rect = svg.append("rect")
        .attr("class", "svg-listener-rect")
        .attr("width", width)
        .attr("height", height)
        .on("mousemove", handleMouseMove)
        .on("mouseleave", () => {
            tooltip.transition()
                .duration(100)
                .style("opacity", 0)
                .style("transform", "scale(0)")
            if (config.is_line) {
                line.style("opacity", 0)
            } else {
                circle.style("opacity", 0).style("transform", "scale(0)")
            }
        })

    function handleMouseMove(event) {
        const {xPos,yPos,d} = calculatePosition(data, event, this)
        console.log(yPos)
        const tooltipWidth = tooltip.node().offsetWidth
        const tooltipHeight = tooltip.node().offsetHeight
        const rectWidth = this.width.animVal.value

        let tool_pos_x = xPos+tooltipWidth <= rectWidth
        let tool_pos_y = yPos-tooltipHeight >= 0

        let offset_x = tool_pos_x? MARGIN_LEFT:MARGIN_LEFT-tooltipWidth
        let offset_y = tool_pos_y? yPos:yPos+tooltipHeight

        let tooltip_text = `<p>${config.axis.x.tooltipFormat(d['date'])}</p>`
        if (config.y.length) {
            config.y.forEach((value) => {
                tooltip_text += "<p>" + (d[value]).toString() + config.axis.y.unit + "</p>"
            })
        } else {
            tooltip_text += `<p>${(d[config.y]).toString() + config.axis.y.unit}</p>`
        }

        tooltip.style("top", `${offset_y}px`)
            .style("left", `${xPos + offset_x}px`)
            .html(tooltip_text)
            .transition()
            .duration(100)
            .style("opacity", 1)
            .style("transform", "scale(1)")
        
        if (config.is_line) {
            line.style("opacity", 1)
                .attr("x1", xPos)
                .attr("x2", xPos)

        } else {
            circle.attr("cx", xPos)
                .attr("cy", yPos)
                .style("opacity", 1)
                .style("transform", "scale(1)")
        }
    
    }

    function calculatePosition(data, e, rect) {
        const [xCoord] = d3.pointer(e, rect)
        const x0 = x.invert(xCoord)
        const bisectDate = d3.bisector(d => d[config.x]).left
        const i = bisectDate(data, x0, 1)
        const d0 = data[i - 1]
        const d1 = data[i]
        const d = x0 - d0[config.x] > d1[config.x] - x0 ? d1 : d0
        const xPos = x(d[config.x])

        if (Array.isArray(config.y)) {
            if (config.y.length == 1) {
                const yPos = y(d[config.y[0]])
                return {xPos, yPos, d}
            }
            
            const yPositions = []
            config.y.forEach(position => {
                yPositions.push(y(d[position]))
            })
            console.log(yPositions)
            return {xPos, yPositions, d}
        }
        
        const yPos = y(d[config.y])
        return {xPos, yPos, d}
    }

    function enable() {
        circle.attr("style", "display:static;")
        rect.attr("style", "pointer-events:all;")
    }
    
    function disable() {
        circle.attr("style", "display:none;")
        rect.attr("style", "pointer-events:none;")
    }

    function remove() {
        rect.remove()
        tooltip.remove()
        circle.remove()
    }
    
    return {
        remove,
        enable,
        disable
    }
}