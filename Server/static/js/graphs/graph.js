function transformData(data) {            
    const transformedData = data.map((element) => {
        return {
            // Normalize data for the graph
            time: new Date(element.time).toISOString(),
            temp: element.temp,
            humi: element.humi,
            pres: element.pres,
            lux: element.lux,
            high: element.high,
            mid: element.mid,
            low: element.low,
            amp: element.amp,
            nh3: element.nh3,
            red: element.red,
            oxi: element.oxi,
            pm10: element.pm10,
            pm100: element.pm100,
            pm25: element.pm25,
        };
    });
    return transformedData
}
// Reload graph chart
function destroyAllCharts() {
    graphChartTempInput.destroy();
    graphChartHumiInput.destroy();
    graphChartPresInput.destroy();
    graphChartLuxInput.destroy();
    graphChartNoiseInput.destroy();
    if (gas_sensor) graphChartGasInput.destroy();
    if (particulate_sensor) graphChartPmInput.destroy();
}