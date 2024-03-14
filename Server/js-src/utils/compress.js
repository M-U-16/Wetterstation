// calculates the average temp, humi and lux level
// of the given month
function average_one_month(data) {
    const ENTRY_AMOUNT = data.length
    let new_entry = { ...data[0] }
    data.forEach((entry, index) => {
        new_entry.humi += entry.humi
        new_entry.lux += entry.lux
        new_entry.temp += entry.temp

    })
    new_entry.humi = Math.round(new_entry.humi / ENTRY_AMOUNT)
    new_entry.lux = Math.round(new_entry.lux / ENTRY_AMOUNT)
    new_entry.temp = Math.round(new_entry.temp / ENTRY_AMOUNT)
    return new_entry
}

// function for compressing
// entry data of 1 year
/*  
    compressed values:
        - humidity
        - temperature
        - light level
*/
export function compress_one_year(data) {
    data = data.map(entry => {
        return {
            entry_date: entry.entry_date,
            humi: entry.humi,
            lux: entry.lux,
            temp: entry.temp
        }
    })

    // gets the start and end index of each month
    // in the array of entrys
    const month_index = {}
    let current_month = null
    data.forEach((entry, index) => {
        const month = entry.entry_date.split("-")[1]
        if (index === 0) current_month = month
        
        if (!Object.keys(month_index).includes(month))
            month_index[month] = {start: index}
        if (
            current_month != month ||
            index === data.length - 1
        )
            month_index[current_month].end = index-1

        current_month = month
    })

    const sorted_months = {}
    const allMonths = Object.keys(month_index).sort()
    allMonths.forEach((month, index) => {
        sorted_months[month] = data.slice(
            month_index[month].start,
            month_index[month].end + 1
        )
        if (index === allMonths.length -1) {
            sorted_months[month].push(data[data.length-1])
        }
    })
    const compressed_year = allMonths.map(month => {
        return average_one_month(sorted_months[month])
    }).sort((prev, now) => {
        if (prev.entry_date < now.entry_date) return -1
        if (prev.entry_date > now.entry_date) return 1
        return 0
    }) // sorts in ascending order
    // if now sorted there problems
    return compressed_year
}