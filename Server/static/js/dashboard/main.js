(async() => {
    const container = "#main-graph-container"
    const el = document.querySelector(container)

    const entrys = await fetch(`/api/data?time=1y`)
        .then(res => res.json())

    const diagramm = WeatherDiagramm({
        margin: {
            top: 30,
            right: 60,
            bottom: 40,
            left: 60
        },
        width: el.offsetWidth,
        height: 300,
        formatEntrys: (entrys) => {
            const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S")
            return entrys.map(entry => {
                const formatedObj = {}
                formatedObj["entry_date"] = parseDate(entry["entry_date"])
                formatedObj["temp"] = entry["temp"]
                formatedObj["humi"] = entry["humi"]

                return formatedObj
            });
        },
        formatEntry: (entry) => {
            const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S")
            return {
                entry_date: parseDate(entry.entry_date),
                temp: entry.temp,
                humi: entry.humi
            }
        },
        container: "main-graph-svg" 
    })
    diagramm.init(container, "main-graph-svg", compress_one_year(entrys.data))
    diagramm.addLine("entry_date", "humi", "lightblue", 4)
    diagramm.addArea("entry_date", "humi", "lightblue", 0.2)
    diagramm.addLine("entry_date", "temp", "red", 4)
})()