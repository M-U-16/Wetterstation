const fetchChartData = async(
    time,
    func
) => {
    return fetch(`/api/data?time=${time}`)
        .then(res => res.json())
        .then(func)
}

const chartController = () => {
    
    let current_time_range = "1m"
    let temp_graph, humi_graph
    let allCharts = []

    const getData = async(time) => await fetchChartData(time, res=>res.data)
    const resizeAll = () => allCharts.forEach(chart => chart.resize())
    const drawCharts = (data) => {
        console.log(data)
        if (!data) return
        
        temp_graph = LineChart(
            getConfig(
                "#temp-container", data,
                "entry_date", "temp",
                current_time_range, "temp-graph-svg"
            )
        )
        humi_graph = LineChart(
            getConfig(
                "#humi-container", data,
                "entry_date", "humi",
                current_time_range, "humi-graph-svg"
            )
        )
        temp_graph.init()
        humi_graph.init()
        allCharts = [temp_graph, humi_graph]
        allCharts.forEach(chart => chart.drawChart())
    }
    const updateChart = async(data) => {
        if (data.length == 0) {
            allCharts.forEach(chart => {

            })
            return
        }

        allCharts.forEach(chart => {
            chart.conf.axisFormat = getTimeRange(
                current_time_range,
                chart.conf.y_unit
            )
            chart.setData(data)
            chart.update()
        })
    }
    
    /* SELECT ELEMENT */
    const select = Select(current_time_range)
    select.init()
    select.addListeners(
        //callback function for updating
        //current time period and data
        async(time) => {
            current_time_range = time
            updateChart(await getData(current_time_range))
        }
    )
    const drawFirstCharts = async() => {
        drawCharts(await getData(current_time_range))
    }
    return {
        drawFirstCharts,
        drawCharts,
        drawCharts,
        resizeAll,
        getData,
    }
}