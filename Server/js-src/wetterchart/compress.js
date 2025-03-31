// calculates the average temp, humi and lux level
// of the given month
function average_one_month(data) {
    const entry_amount = data.length
    let new_entry = { ...data[0] }
    // sum all entries
    data.forEach((entry, index) => {
        new_entry.humi += entry.humi
        new_entry.lux += entry.lux
        new_entry.temp += entry.temp
    })
    new_entry.humi = Math.round(new_entry.humi / entry_amount)
    new_entry.lux = Math.round(new_entry.lux / entry_amount)
    new_entry.temp = Math.round(new_entry.temp / entry_amount)
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
    if (!data) {
        console.error("No data provided to function")
        return
    }

    data = data.map(entry => {
        return {
            date: entry.date,
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
        const month = entry.date.split("-")[1]
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
        if (prev.date < now.date) return -1
        if (prev.date > now.date) return 1
        return 0
    }) // sorted in ascending order

    return compressed_year
}

/*
*/
export function average_per_day(data=[], data_points=[]) {
    if (data.length == 0) {
        return []
    }

    if (data_points.length == 0) {
        return data
    }

    // array containing averaged data of the days
    let averaged_days = []

    // use first value as starting date
    let day = new Date(data[0].date)
    let current_day
    let current_entry = {
        count: 0,
        data: null
    }

    data.push(0)
    data.forEach(entry => {
        current_day = new Date(entry.date)

        if (current_day.getDate() != day.getDate() || entry == 0) {
            data_points.forEach(point => {
                current_entry.data[point] = +(
                    current_entry.data[point] / current_entry.count
                ).toFixed(2)
            })
            averaged_days.push(current_entry.data)
            current_entry.data = null
            day = current_day
        }
        
        if (!current_entry.data) {
            current_entry.count = 1
            current_entry.data = entry
            return
        }

        data_points.forEach(point => {
            current_entry.data[point] += entry[point]
        })

        current_entry.count++
    })

    return averaged_days
}