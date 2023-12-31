let graph
let temp_graph, humi_graph
let time = "1m"

function generateGraphs(data) {
    const temp_config = getConfig(
        "#temp-container",
        data,
        "entry_date",
        "temp",
        time,
        "temp-graph-svg"
    )
    const humi_config = getConfig(
        "#humi-container",
        data,
        "entry_date",
        "humi",
        time,
        "humi-graph-svg"
    )

    temp_graph = LineChart(temp_config)
    temp_graph.init()
    temp_graph.drawChart()

    humi_graph = LineChart(humi_config)
    humi_graph.init()
    humi_graph.drawChart()
}

window.onresize = () => {
    temp_graph.resize()
    humi_graph.resize()
}

fetch(`/api/data?time=${time}`)
    .then(res => res.json())
    .then(res => generateGraphs(res.data.reverse()))
