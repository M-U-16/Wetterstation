// Request to get graph data
function getGraph() {
    frequency = document.getElementById("time-select-button").dataset.current
    console.log(frequency)
    let currentTime = Date.now() / 1000;
    if (
        frequency != last_frequency //|| currentTime - last_graph >= frequencies[frequency].poll
    ) {
        /* last_frequency = frequency; */
        last_graph = currentTime;
  
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("getGraph(): ", JSON.parse(this.responseText).data);
                const data = transformData(JSON.parse(this.responseText).data)
                
                console.log(data)
                //looks if it is first run when it is sets firstrun false
                /* !firstRun ? destroyAllCharts() : firstRun = false */
                //draw the graphs
                /* drawGraph(transformedData); */
            }
        };
    
        xhttp.open("GET", "/api/data?time=" + frequency, true);
        xhttp.send();
    }
}