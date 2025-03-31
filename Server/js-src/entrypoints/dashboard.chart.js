import { LineChart } from "../chart/lineChartV2"
import { Select } from "../components/select"
import { compress_one_year } from "../wetterchart/compress"
import { GetConfig, getAxisFormat } from "../chart/config-builder"
import { InfoPopup } from "../components/info-popup"

localStorage.setItem("theme-mode", "dark-theme")
customElements.define("info-popup", InfoPopup)

let current_time = "1y"

/* SELECT ELEMENT */
const select = Select(current_time)
select.init()

drawCharts().then(graphs => {
    //select.init((value) => updateGraphs(graphs, value))
    document.addEventListener("select:click", (event) => {
        updateGraphs(graphs, event.detail.value)
    })
})

async function drawCharts() {
    let data = await fetchChartData("1y")

    const graph_temp = LineChart(
        GetConfig(
            "#temp-container",
            compress_one_year(data),
            "date",
            "temp",
            "1y",
            "svg-graph-temp"
        )
    )
    const graph_humi = LineChart(
        GetConfig(
            "#humi-container",
            compress_one_year(data),
            "date",
            "humi",
            "1y",
            "svg-graph-humi"
        )
    )
    return [graph_temp, graph_humi]
}

async function updateGraphs(graphs, value) {
    let data = await fetchChartData(value)
    if (data.length > 5) { 
        if (value === "1y") {
            data = compress_one_year(data)
        }

        graphs.forEach(graph => {
            graph.setData(data)
            graph.updateAxisFormat(
                getAxisFormat(value, graph.config.y_unit, graph.config.y)
            )
            graph.updateConfig(value)
            graph.updateGraph(0)
        })
    } else {
        const popup = NewFlashedMessage("Keine Date für diesen Zeitraum!", "error")
        document.querySelector("#dashboard-right-bottom")
            .appendChild(popup)
    }
}

async function fetchChartData(time) {
    return fetch(`/api/data?time=${time}`)
        .then(res => res.json())
        .then(res => res.data)
}