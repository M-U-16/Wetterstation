const fetchChartData = async(time) => {
    return fetch(`/api/data?time=${time}`)
        .then(res => res.json())
}

const chartController = () => {

    const DEFAULT_TIME_RANGE = "1d"
    const select = Select(DEFAULT_TIME_RANGE)
    
    let current_time_range = DEFAULT_TIME_RANGE
    let temp_graph, humi_graph, data, allCharts

    const setData = async(time) => { data = await fetchChartData(time) }
    const drawCharts = (arr) => { arr.forEach(graph => { graph.drawChart() }); }
    const initCharts = (data) => {
        
        temp_graph = LineChart(
            getConfig(
                "#temp-container",
                data,
                "entry_date",
                "temp",
                chartFrequency,
                "temp-graph-svg"
            )
        )
        humi_graph = LineChart(
            getConfig(
                "#humi-container",
                data,
                "entry_date",
                "humi",
                chartFrequency,
                "humi-graph-svg"
            )
        )
        
        temp_graph.init()
        humi_graph.init()

        allCharts = [temp_graph, humi_graph]
    }


    return {
        setData
    }
}

window.onresize = () => {
    temp_graph.resize()
    humi_graph.resize()
}

/* 
fetch(`/api/data?time=${chartFrequency}`)
    .then(res => res.json())
    .then(res => {
        if (res.data.length == 0) {
            initCharts(res.data.reverse())
        } else {
            initCharts(res.data.reverse())
            drawCharts([temp_graph, humi_graph])
        }
    }) */