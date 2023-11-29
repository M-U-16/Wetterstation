const frequencies = {
    day: { major: 3 * 3600, minor: 3600, poll: 60 },
    week: { major: 24 * 3600, minor: 6 * 3600, poll: 600 },
    month: { major: 7 * 24 * 3600, minor: 24 * 3600, poll: 1440 },
    year: { major: 31 * 24 * 3600, minor: 7 * 24 * 3600, poll: 17280 },
};
//get the current frequency depending on time period
function getFrequency(frequency) {
    if (frequency === "day") return "hour"
    if (frequency === "week") return "day"
    if (frequency === "month") return "day"
    if (frequency === "year") return "month"
    return frequency
}