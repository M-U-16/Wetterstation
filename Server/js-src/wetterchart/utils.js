/**
@param data array of data points, each containing a date field with a javascript Date object
@param interval period (in seconds) of the normal time interval in the data
@param gap_size a number (1,2,3) saying how many intervals can be skipped before it counts as a gap, defaults to one

This function looks if there are gaps (time gaps e.g. 2025-3-28 23:00:00,2025-4-14 01:00:00)
in the given data and returns a two dimensional array containing the start and
end index of the data points where a gap is.

A gap is where the difference (in seconds) of the current date and the last
date is greater than the given interval (also in seconds) * the gap size (integer number 1,2,3)

For example:
interval = 60*60 (one hour in seconds), gap_size=3

We have this data (assuming the data is taken every hour): [
0    {date: new Date("2025-3-28 23:00:00"), anydata: 1},
1    {date: new Date("2025-3-29 00:00:00"), anydata: 2},
2    {date: new Date("2025-3-29 01:00:00"), anydata: 3},
3    {date: new Date("2025-3-29 01:00:00"), anydata: 4}, -> here is a gap
4    {date: new Date("2025-4-14 00:00:00"), anydata: 5}, -> here is a gap
5    {date: new Date("2025-4-14 01:00:00"), anydata: 6},
6    {date: new Date("2025-4-14 02:00:00"), anydata: 7}, -> here is a gap
7    {date: new Date("2025-4-14 06:00:00"), anydata: 8}, -> here is a gap
7    {date: new Date("2025-4-14 09:00:00"), anydata: 9}, -> here is a gap, but difference is not greater 3*60*60
]

And the function would return: [[3, 4], [6, 7]]
[3,4] is the start and end index of the first gap in the data array
[6,7] is the start and end index of the second gap in the data array
**/
export function date_gap_analyzer(data=[], interval, gap_size=1) {
    if (data.length == 0) {
        return []
    }

    let last_date = null
    let last_idx = 0

    const gaps = []
    data.forEach((entry, idx) => {
        if (!last_date) {
            last_date = entry.date
            return
        }

        let time_diff = d3.timeSecond.count(last_date, entry.date)
        if ((time_diff/interval) > gap_size) {
            gaps.push([last_idx, idx])
        }

        if (idx != data.length-1) {
            last_date = entry.date
            last_idx = idx
        }
    });

    return gaps
}

import {timelocale} from "./local" 

export function find_best_format(start_date, end_date) {
    const daydiff = d3.timeDay.count(start_date, end_date)

    if (daydiff <= 1) { // data from one day
        const hourdiff = d3.timeHour.count(start_date, end_date)
        if (hourdiff <= 1) { // data from one hour or less
            return {
                ticks: d3.timeMinute.every(10),
                timeFormat: timelocale.format("%H:%M:%S")
            }
        }

        return {
            ticks: d3.timeHour.every(1),
            timeFormat: function(d) {
                const hour = timelocale.format("%H")(d)
                if (hour[0] == "0") {
                    return hour[1]
                }
                return  hour
            }
        }
    }

    if (daydiff < 3) {
        return {
            ticks: d3.timeDay.every(1),
            timeFormat: timelocale.format("%A")
        }
    } else if (daydiff < 7) {
        return {
            ticks: d3.timeDay.every(1),
            timeFormat: timelocale.format("%a")
        }
    }

    if (daydiff > 7 && daydiff < 21) {
        return {
            ticks: d3.timeDay.every(3),
            timeFormat: timelocale.format("%-d.%B")
        }
    }

    if (daydiff >= 21 && daydiff <= 31) { // data from close to one month
        return {
            ticks: d3.timeWeek.every(1),
            timeFormat: timelocale.format("%e %b")
        }
    }

    const monthdiff = d3.timeMonth.count(start_date, end_date)
    if (monthdiff < 3) {
        return {
            ticks: d3.timeMonth.every(1),
            timeFormat: timelocale.format("%-d.%B")
        }
    } else if (monthdiff <= 5) {
        return {
            ticks: d3.timeMonth.every(1),
            timeFormat: timelocale.format("%B")
        }
    } else if (monthdiff <= 12) {
        return {
            ticks: d3.timeMonth.every(1),
            timeFormat: timelocale.format("%b")
        }
    }

    if (monthdiff > 12) {
        console.log("diff > 12 months")
        return {
            ticks: d3.timeMonth.every(2),
            timeFormat: function(d) {
                if (d.getMonth() === 0) {
                    return timelocale.format("%Y")(d)
                } else {
                    return timelocale.format("%b")(d)
                }
            }
        }
    }
}