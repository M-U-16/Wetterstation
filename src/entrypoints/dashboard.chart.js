import { LineChart } from "../chart/lineChartV2"
import { Select } from "../components/select"
import { compress_one_year } from "../utils/compress"
import { getConfig } from "../chart/config-builder"
import { setD3DE } from "../utils/local-d3"

setD3DE()

const fetchChartData = async(time) => {
    return fetch(`/api/data?time=${time}`)
        .then(res => res.json())
        .then(res => res.data)
}
    
/* SELECT ELEMENT */
let current_time = "1y"
const select = Select(current_time)
select.init((value) => current_time = value)

drawCharts() // draw all charts

async function drawCharts() {
    const data = await fetchChartData("1y")

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
}