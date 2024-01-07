(() => {
    const container = "#main-graph-container"
    const el = document.querySelector(container)

    const diagramm = WeatherDiagramm({
        margin: {
            top: 40,
            right: 60,
            bottom: 40,
            left: 30
        },
        width: el.innerWidth,
        height: 300,
        entrys: [],
        formatEntrys: (entrys, config) => {
            const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S")
            return entrys.map(entry => {
                const formatedObj = {}
                formatedObj["entry_date"] = parseDate(entry[config.x])
                formatedObj["temp"] = entry["temp"]
                formatedObj["humi"] = entry["humi"]
                return formatedObj
            });
        },
        formatEntry: (entry, config, parser) => {
            const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S")
            return {
                entry_date: parseDate(entry.entry_date),
                temp: entry.temp,
                humi: entry.humi
            }
        },
        container: "main-graph-svg" 
    })
    diagramm.addSvg(container, "main-graph-svg" )
})()