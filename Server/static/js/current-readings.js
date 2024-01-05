const date = document.querySelector("#current-date-value")
const temp = document.querySelector("#current-temp-value")
const humi = document.querySelector("#current-humi-value")
const lux = document.querySelector("#current-lux-value")
console.log(date, temp, humi)

socket.on("new-reading", (data) => {
    date.innerHTML = data.entry_date
    temp.innerHTML = data.temp
    humi.innerHTML = data.humi
    lux.innerHTML = data.lux
})