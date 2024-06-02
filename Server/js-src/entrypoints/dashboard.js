import { socket } from "../socket";
import { LineChart } from "../chart/lineChartV2"
import { GetConfig } from "../chart/config-builder"

const GRAPH_LOADERS = document.querySelectorAll("#graphs-container #spinner")
const AMOUNT_FIRST_ENTRYS = 7

let entry_buffer = []
let loadingData = true

main()

socket.on("new-reading", (data) => {
    document.dispatchEvent(new CustomEvent("socket:readings", {
        bubbles: true,
        detail: { data: data }
    }))
})

async function main() {
    let graphs

    document.addEventListener("socket:readings",
        async(event) => {
            const data = event.detail.data

            if (!loadingData) {
                updateGraphs(data, graphs)
                return
            }

            if (loadingData) {
                entry_buffer.push(data)
            }

            if (entry_buffer.length > 5 && loadingData) {
                graphs = await drawCharts(entry_buffer)
                if (graphs) {
                    setTimeout(() => {
                        GRAPH_LOADERS.forEach(loader => loader.remove())
                    }, 500)
                    loadingData = false
                    entry_buffer = null
                }
            }
        }
    )
}
    
async function drawCharts(data) {
    const graph_temp = LineChart(
        GetConfig({
            container_id: "#temp-container",
            data: data,
            x: "entry_date",
            y: "temp",
            timePeriod: "1d",
            id: "svg-graph-temp",
            responsive: false
        })
    )
    const graph_humi = LineChart(
        GetConfig({
            container_id: "#humi-container",
            data: data,
            x: "entry_date",
            y: "humi",
            timePeriod: "1d",
            id: "svg-graph-humi",
            responsive: false
        })
    )
    return [ graph_temp, graph_humi ]
}

async function fetchChartData() {
    return fetch(`/api/data?entrys=${AMOUNT_FIRST_ENTRYS}`)
        .then(res => res.json())
        .then(res => res.data)
}

async function updateGraphs(data, graphs) {
    graphs.forEach(graph => {
        graph.addData(data)
        graph.shiftData()
        graph.updateGraph(200)
    }) 
}