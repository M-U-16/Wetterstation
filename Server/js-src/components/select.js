export function Select(start_range) {

    const selectContainer = document.querySelector("#select-container")
    const timeRangeBtn = document.getElementById("time-select-button")
    const selectOptions = document.querySelectorAll(".app__select-option")
    const optionsContainer = document.querySelector(".app__select-options-container")
    const indicatorArrow = document.querySelector("#select-arrow-icon")
    const timeRangeDisplay = document.querySelector("#time-select-text")
    
    const activeContainerClass = "active-select-container"
    const activeButtonClass = "active-select-button"
    
    let selectedState = false

    function closeAll() {

        timeRangeBtn.classList.toggle(activeButtonClass)
        optionsContainer.classList.remove(activeContainerClass)

        indicatorArrow.style.transform = `translate(0, -50%) rotate(0deg)`
        selectedState = false
    }

    function addListeners() {
        /* ADDS EVENTLISTENER TO SELECT BUTTON */
        timeRangeBtn.addEventListener("click", () => {
            selectedState = !selectedState
            timeRangeBtn.classList.toggle(activeButtonClass)
            optionsContainer.classList.toggle(activeContainerClass)

            if (!selectedState) indicatorArrow.style.transform = `translate(0, -50%) rotate(0deg)`
            if (selectedState) indicatorArrow.style.transform = `translate(0, -50%) rotate(180deg)`
        })
        /* ADDS CLICK EVENTLISTENER TO EVERY OPTION BUTTON */
        selectOptions.forEach(option => {
            option.addEventListener("click", () => {
                timeRangeDisplay.innerHTML = option.innerHTML
                timeRangeBtn.dataset.current = option.dataset.value
                const clickEvent = new CustomEvent("select:click", {
                    bubbles: true,
                    detail: {value: option.dataset.value}
                })
                selectContainer.dispatchEvent(clickEvent)
                closeAll()
            })
        })
    }

    function init() {
        addListeners()
        timeRangeBtn.dataset.current = start_range
        selectOptions.forEach(option => {
            if (option.dataset.value == start_range) {
                timeRangeDisplay.innerHTML = option.innerHTML
            }
        })
    }

    return {
        init,
        addListeners
    }
}