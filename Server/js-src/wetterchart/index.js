export async function updateGraphs(graphs, data, value) {
    graphs.forEach(graph => {
        graph.setData(data)
        graph.updateAxisFormat(
            GetAxisFormat(value, graph.config.y_unit, graph.config.y)
        )
        graph.updateConfig(value)
        graph.updateGraph(0)
    })
}


export async function FetchData(type, time) {
    return fetch(`/api/data?${type}=${time}`)
        .then(res => res.json())
        .then(res => res.data)
}

export { LineChart } from "./lineChartV2"
export { GetConfig, GetYAxisFormat } from "./config-builder"
export { compress_one_year } from "./compress"
export * from "./config"