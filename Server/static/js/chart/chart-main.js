(async() => {
    const fetchChartData = async(time) => {
        return fetch(`/api/data?time=${time}`)
            .then(res => res.json())
            .then(res => res.data)
    }
    
    const controller = chartController()
    controller.drawCharts(await fetchChartData("1y"))
    //window.onresize = () => controller.resizeAll()
})()