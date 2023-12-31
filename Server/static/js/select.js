const Select = (start_time) => {

    const timeRangeBtn = document.getElementById("time-select-button")
    const selectOptions = document.querySelectorAll(".app__select-option")
    const selectContainer = document.querySelector(".app__select-options-container")
    const indicatorArrow = document.querySelector("#select-arrow-icon")
    const timeRangeDisplay = document.querySelector("#time-select-text")
    const activeContainerClass = "active-select-container"
    
    let selectedState = false

    const closeContainer = () => {
        selectContainer.classList.remove(activeContainerClass)
        indicatorArrow.style.transform = `rotate(${0}deg)`
        selectedState = false
    }

    const addListeners = (optionAction) => {
        /* ADDS EVENTLISTENER TO SELECT BUTTON */
        timeRangeBtn.addEventListener("click", () => {
            selectedState = !selectedState
            
            selectContainer.classList.toggle(activeContainerClass)
            if (!selectedState) indicatorArrow.style.transform = `rotate(${0}deg)`
            if (selectedState) indicatorArrow.style.transform = `rotate(${180}deg)`
        })
        /* ADDS CLICK EVENTLISTENER TO EVERY OPTION BUTTON */
        selectOptions.forEach(option => {
            option.addEventListener("click", () => {
                //if (option.innerHTML != timeRangeDisplay.innerHTML) {
                timeRangeDisplay.innerHTML = option.innerHTML
                timeRangeBtn.dataset.current = option.dataset.value
                optionAction(option.dataset.value)
                closeContainer()
            })
        })
    }

    const init = () => {
        selectOptions.forEach(option => {
            timeRangeBtn.dataset.current = start_time
            if (option.dataset.value == start_time) {
                timeRangeDisplay.innerHTML = option.innerHTML
            }
        })
    }

    return {
        init,
        addListeners
    }
}