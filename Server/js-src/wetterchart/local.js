export let timelocale = d3.timeFormat
export let formatlocale = d3.format

export function setDefault() {
    formatlocale = d3.format
    timelocale = d3.timeFormat
}

export function setDE() {
    // set default locale
    formatlocale = d3.formatDefaultLocale({
        "decimal": ",",
        "thousands": ".",
        "grouping": [3],
        "currency": ["", "\u00a0€"]
    })
    //d3.formatDefaultLocale(formatLocale)

    // set default time locale
    timelocale = d3.timeFormatLocale({
        "dateTime": "%A, der %e. %B %Y, %X",
        "date": "%d.%m.%Y",
        "time": "%H:%M:%S",
        "periods": ["AM", "PM"],
        "days": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
        "shortDays": ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
        "months": ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
        "shortMonths": ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
    })

    let formatMillisecond = d3.timeFormat(".%L")
    let formatSecond = d3.timeFormat(":%S")
    let formatMinute = d3.timeFormat("%I:%M")
    let formatHour = d3.timeFormat("%I %p")
    let formatDay = d3.timeFormat("%a %d")
    let formatWeek = d3.timeFormat("%b %d")
    let formatMonth = d3.timeFormat("%B")
    let formatYear = d3.timeFormat("%Y")
    function tickFormat(date) {
        function multiFormat(date) {
            return (
                d3.timeSecond(date) < date ? formatMillisecond
                : d3.timeMinute(date) < date ? formatSecond
                : d3.timeHour(date) < date ? formatMinute
                : d3.timeDay(date) < date ? formatHour
                : d3.timeMonth(date) < date ? (timeWeek(date) < date ? formatDay : formatWeek)
                : d3.timeYear(date) < date ? formatMonth
                : formatYear
            )(date);
        }
        return multiFormat(date);
    }
}