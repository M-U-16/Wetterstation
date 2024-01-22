(async() => {
    const fetchChartData = async(time) => {
        return fetch(`/api/data?time=${time}`)
            .then(res => res.json())
            .then(res => res.data)
    }
    
    /* SELECT ELEMENT */
    const select = Select("1y")
    select.init((value) => {console.log(value)})

    const controller = chartController()
    controller.drawCharts(await fetchChartData("1y"))
    //window.onresize = () => controller.resizeAll()
})()