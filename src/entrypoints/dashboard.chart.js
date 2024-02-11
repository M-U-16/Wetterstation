import { LineChart } from "../chart/lineChartV2"
import { Select } from "../components/select"
import { compress_one_year } from "../utils/compress"
import { getConfig, getAxisFormat } from "../chart/config-builder"

const fetchChartData = async(time) => {
    return fetch(`/api/data?time=${time}`)
        .then(res => res.json())
        .then(res => res.data)
}
    
/* SELECT ELEMENT */
let current_time = "1y"
const select = Select(current_time)

drawCharts().then(graphs => {
    select.init((value) => updateGraphs(graphs, value))
})

async function drawCharts() {
    let data = await fetchChartData("1y")

    const graph_temp = LineChart(
        getConfig(
            "#temp-container",
            compress_one_year(data),
            "entry_date",
            "temp",
            "1y",
            "svg-graph-temp"
        )
    )
    const graph_humi = LineChart(
        getConfig(
            "#humi-container",
            compress_one_year(data),
            "entry_date",
            "humi",
            "1y",
            "svg-graph-humi"
        )
    )
    return [graph_temp, graph_humi]
}

async function updateGraphs(graphs, value) {
    let data = await fetchChartData(value)
    if (value === "1y") {
        data = compress_one_year(data)
    }

    graphs.forEach(graph => {
        graph.setData(data)
        graph.updateAxisFormat(
            getAxisFormat(value, graph.config.y_unit, graph.config.y)
        )
        graph.updateGraph(0)
    })
}