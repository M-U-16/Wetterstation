function chartController() {
    
    let current_time_range = "1y"
    
    /* function resizeAll() {
        allCharts.forEach(chart => chart.resize())
    } */
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
    /* async function updateChart(data) {
        
        if (data.length == 0) return
        if (current_time_range === "1y") {
            data = compress_one_year(data)
        }

        allCharts.forEach(chart => {
            chart.conf.axisFormat = getAxisFormat(
                current_time_range,
                chart.conf.y_unit,
                chart.conf.y
            )
            chart.setData(data)
            chart.update()
        })
    } */
    
    /* SELECT ELEMENT */
    /* const select = Select(current_time_range)
    select.init()
    select.addListeners(
        //callback function for updating
        //current time period and data
        async(time) => {
            current_time_range = time
            updateChart(await getData(current_time_range))
        }
    )
    async function drawFirstCharts() {
        drawCharts(await getData(current_time_range))
    } */
    return {
        drawCharts,
        drawCharts,
    }
}