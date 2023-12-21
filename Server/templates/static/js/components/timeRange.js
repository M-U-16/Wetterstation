const form = document.getElementById("range-form-element")
form.addEventListener("submit", (e) => { postRangeForm(e) })

const postRangeForm = (e) => {
    e.preventDefault()
    const childs = e.target.children
    const dates = {}
    for (const child in childs) {
        const elm = childs[child]
        if (elm.nodeName === "INPUT") {
            dates[elm.name] = elm.value
        }
    }
    console.log(dates)
}