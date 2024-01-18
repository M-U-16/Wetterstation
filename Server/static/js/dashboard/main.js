(async() => {
    const container = "#main-graph-container"
    const el = document.querySelector(container)

    const entrys = await fetch(`/api/data?time=1y`)
        .then(res => res.json())

    const diagramm = WeatherDiagramm({
        margin: {
            top: 30,
            right: 60,
            bottom: 30,
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
    /* diagramm.init(
        container, "main-graph-svg",
        compress_one_year(entrys.data),
        "temp", "humi"
    )
    //diagramm.addBarRect("entry_date", "humi")
    //diagramm.addLine("entry_date", "humi", "rgb(0, 119, 255)", 4)
    diagramm.addLine("entry_date", "temp", "red", 4)
    diagramm.addArea("entry_date", "temp", "rgb(222, 0, 0)", 0.1)

    diagramm.addAxis() */
})()