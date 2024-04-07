export function LiveEntrys() {
    
    const date = document.querySelector("#current-date-value")
    const temp = document.querySelector("#current-temp-value")
    const humi = document.querySelector("#current-humi-value")
    const lux = document.querySelector("#current-lux-value")
    
    function update() {
        date.innerHTML = data.entry_date
        temp.innerHTML = data.temp
        humi.innerHTML = data.humi
        lux.innerHTML = data.lux
    }

    return update
}