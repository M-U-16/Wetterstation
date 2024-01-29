function chartController() {
    
    let current_time_range = "1y"
    function drawCharts(data) {
        if (!data) return
        if (current_time_range === "1y") {
            data = compress_one_year(data)
        }

        let temp_graph = LineChart(
            getConfig(
                "#temp-container", data,
                "entry_date", "temp",
                current_time_range, "temp-graph-svg"
            )
        )
        let humi_graph = LineChart(
            getConfig(
                "#humi-container", data,
                "entry_date", "humi",
                current_time_range, "humi-graph-svg"
            )
        )
    }
    return {
        drawCharts,
    }
}