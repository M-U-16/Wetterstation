export default function(format="%Y-%m-%d %H:%M:%s") {
    const parseDate = d3.timeParse(format)
    
    function formatEntrys(entrys, ...args) {
        return entrys.map(entry => {
            const formatedObj = {}
            formatedObj.date = parseDate(entry["date"])
            args.forEach(arg => formatedObj[arg] = entry[arg])
            return formatedObj
        })
    }

    function formatEntry(entry, ...args) {
        const formatedEntry = {}
        formatedEntry.date = parseDate(entry.date)
        args.forEach(arg => formatedEntry[arg] = entry[arg])
        return formatedEntry
    }
    
    return {
        formatEntrys,
        formatEntry
    }
}