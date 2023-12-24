const timeRangeBtn = document.getElementById("time-select-button")
const selectOptions = document.querySelectorAll(".app__select-option")
const selectContainer = document.querySelector(".app__select-options-container")
const indicatorArrow = document.querySelector("#select-arrow-icon")
const timeRangeDisplay = document.querySelector("#time-select-text")
const activeContainerClass = "active-select-container"
let selectedState = false
let currentFrequency

timeRangeBtn.dataset.current = "1d"

const closeContainer = () => {
    selectContainer.classList.remove(activeContainerClass)
    indicatorArrow.style.transform = `rotate(${0}deg)`
    selectedState = false
}

timeRangeBtn.addEventListener("click", () => {
    selectedState = !selectedState
    
    selectContainer.classList.toggle(activeContainerClass)
    if (!selectedState) indicatorArrow.style.transform = `rotate(${0}deg)`
    if (selectedState) indicatorArrow.style.transform = `rotate(${180}deg)`
})

selectOptions.forEach(option => {
    option.addEventListener("click", () => {
        if (option.innerHTML != timeRangeDisplay.innerHTML) {
            timeRangeDisplay.innerHTML = option.innerHTML
            timeRangeBtn.dataset.current = option.dataset.value
            currentFrequency = option.dataset.value
            closeContainer()
        }
    })
})