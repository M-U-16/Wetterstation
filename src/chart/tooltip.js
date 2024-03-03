export function TooltipController(
    svg,
    width, height,
    config,
    data, x, y
) {
    const MARGIN_LEFT = config.margin.left
    /* ADDING TOOLTIP */
    const tooltip = d3.select(config.container)
        .append("div")
        .style("opacity", 0)
        .attr("class", "graph-tooltip")

    const circle = svg.append("circle")
        .attr("class", "graph__circle")
        .style("fill", config.styles.dots)
        .attr("r", 5)
        .style("opacity", 0)
        .style("pointer-events", "none")

    const rect = svg.append("rect")
        .attr("class", "svg-listener-rect")
        .attr("width", width)
        .attr("height", height)
        .on("mousemove", function(e) {
            const {xPos,yPos,d} = calculatePosition(data, e, this)
            const tooltipWidth = tooltip.node().offsetWidth
            const tooltipHeight = tooltip.node().offsetHeight
            const rectWidth = this.width.animVal.value
            

            let tool_pos_x = xPos+tooltipWidth <= rectWidth
            let tool_pos_y = yPos-tooltipHeight >= 0

            const offset_x = tool_pos_x?MARGIN_LEFT+5:MARGIN_LEFT-tooltipWidth-5
            const offset_y = tool_pos_y?yPos-16:yPos+tooltipHeight

            circle
                .attr("cx", xPos)
                .attr("cy", yPos)
                .style("opacity", 1)
                .style("transform", "scale(1)")
            tooltip
                .style("top", `${offset_y}px`)
                .style("left", `${xPos + offset_x}px`)
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
    function remove() {
        rect.remove()
        tooltip.remove()
        circle.remove()
    }
    return {
        remove
    }
}