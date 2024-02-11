import { Select } from "../../components/select"
import { chartController } from "../../chart/chart-controller"

// FUNCTION FOR FETCHING DATA FROM API
const fetchChartData = async(time) => {
    return fetch(`/api/data?time=${time}`)
        .then(res => res.json())
        .then(res => res.data)
}

// SELECT ELEMENT
const select = Select("1y")
select.init((value) => {console.log(value)})

// CONTROLLER FOR ALL CHARTS
const controller = chartController()
controller.drawCharts(await fetchChartData("1y"))