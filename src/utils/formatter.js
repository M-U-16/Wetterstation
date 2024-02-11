export default function() {
    function formatEntrys(entrys, ...args) {
        const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S")
        return entrys.map(entry => {
            const formatedObj = {}
            formatedObj.entry_date = parseDate(entry["entry_date"])
            args.forEach(arg => formatedObj[arg] = entry[arg])
            return formatedObj
        })
    }
    function formatEntry(entry, ...args) {
        const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S")
        const formatedEntry = {}
        formatedEntry.entry_date = parseDate(entry.entry_date)
        args.forEach(arg => formatedEntry[arg] = entry[arg])
        return formatedEntry
    }
    return {
        formatEntrys,
        formatEntry
    }
}