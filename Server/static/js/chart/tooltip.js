function TooltipController(
    svg, container,
    width, height,
    config,
    data, x, y
) {
    /* ADDING TOOLTIP */
    console.log(container)
    const tooltip = d3.select(container)
        .append("div")
        .style("opacity", 0)
        .style("border-radius", "5px")
        .attr("class", "graph-tooltip")

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