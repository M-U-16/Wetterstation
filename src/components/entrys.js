export const lastEntrys = async() => {

    const tempIcon = document.getElementById("temperature-icon")
    const humiIcon = document.getElementById("humidity-icon")
    const button = document.getElementById("load-more-entrys-button")
    const container = document.querySelector("#recent-entrys-container")
    
    let current_id

    function formatEntrys(data) {
        const timeParser = d3.timeParse("%Y-%m-%d %H:%M:%S")
        return data.map(entry => {
            entry.entry_date = timeParser(entry.entry_date)
            return entry
        })
    }
    function formatEntryDate(date) {
        const formatter = d3.timeFormat("%A")
        return formatter(date)
    }
    async function getData(last_id) {
        let args = last_id ? `?last=${last_id}` : ""
        return await fetch("/api/entrys"+ args)
            .then(res => res.json())
    }
    function createEntry(entry) {
        const entry_container = document.createElement("div")
        entry_container.className = "recent__entry-container"

        const date = document.createElement("p")
        date.innerHTML = formatEntryDate(entry.entry_date)

        const p_temp = document.createElement("p")

        const p_temp_span = document.createElement("span")
        p_temp_span.innerHTML = entry.temp + "°C"
        const tempClone = tempIcon.cloneNode(true)
        tempClone.style.display = "block"
        p_temp.appendChild(tempClone)
        p_temp.appendChild(p_temp_span)
        
        const p_humi = document.createElement("p")
        
        const p_humi_span = document.createElement("span")
        p_humi_span.innerHTML = entry.humi + "%"
        const humiClone = humiIcon.cloneNode(true)
        humiClone.style.display = "block"
        p_humi.appendChild(humiClone)
        p_humi.appendChild(p_humi_span)

        entry_container.appendChild(date)
        entry_container.appendChild(p_temp)
        entry_container.appendChild(p_humi)

        return entry_container
    }
    function addEntrys(entrys, container) {
        entrys.forEach(entry => {
            container.appendChild(createEntry(entry))
        });
        container.scrollTop = container.scrollHeight
    }
    async function getAddEntrys(id=null) {
        const data = await getData(id)
        current_id = data["last_id"]
        addEntrys(
            formatEntrys(data.data),
            container
        )
    }
    button.addEventListener("click", () => {
        getAddEntrys(current_id)
    })
    getAddEntrys()

}