export function Spinner(container) {
    const spinner = d3.select(container)
        .append("div")
        .attr("class", "spinner")
        .html(`
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
            >
                <circle
                    r="40"
                    cx="50"
                    cy="50"
                    fill="none"
                    stroke="grey"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-dasharray="150 200"
                ></circle>
            </svg>
        `)
    show()

    function hide() {
        spinner.attr("class", "spinner hide")
    }

    function show() {
        spinner.attr("class", "spinner animate")
    }

    return {hide, show}
}