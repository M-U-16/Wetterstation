const timeRangeBtn = document.getElementById("time-select-button")
const selectOptions = document.querySelectorAll(".app__select-option")
const selectContainer = document.querySelector(".app__select-options-container")
const indicatorArrow = document.querySelector("#select-arrow-icon")
const timeRangeDisplay = document.querySelector("#time-select-text")
let selectedState = false
let currentFrequency
const activeContainerClass = "active-select-container"

timeRangeBtn.dataset.current = "1d"

const closeContainer = () => {
    selectContainer.classList.remove(activeContainerClass)
    indicatorArrow.style.rotate = "0deg"
    selectedState = false
}

timeRangeBtn.addEventListener("click", () => {
    selectContainer.classList.toggle(activeContainerClass)
    selectedState = !selectedState
    if (!selectedState) indicatorArrow.style.rotate = "0deg"
    if (selectedState) indicatorArrow.style.rotate = "180deg"
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