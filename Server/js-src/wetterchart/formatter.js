import { timelocale } from "./local"

export function Formatter(format="%Y-%m-%d %H:%M:%S") {
    const parseDate = timelocale.parse(format)
    
    function formatEntrys(entrys, args) {
        return entrys.map(entry => {
            return formatEntry(entry, args)
        })
    }

    function formatEntry(entry, args) {
        const formatedEntry = {}
        formatedEntry.date = parseDate(entry["date"])
        args.forEach(arg => {formatedEntry[arg] = +entry[arg]})
        return formatedEntry
    }
    
    return {
        formatEntrys,
        formatEntry
    }
}