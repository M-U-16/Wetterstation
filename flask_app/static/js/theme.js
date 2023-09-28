const themeBtn = document.getElementById("theme-btn");
/* const themeDarkBtn = document.getElementById("theme-dark"); */
let hasThemeLight = body.classList.contains("theme-light");

const timeRangeLight = document.getElementById("time-range-light")
const timeRangeDark = document.getElementById("time-range-dark")

const fanPowerLight = document.getElementById("fan-power-light")
const fanPowerDark = document.getElementById("fan-power-dark")

const themeLight = document.getElementById("theme-light-img")
const themeDark = document.getElementById("theme-dark-img")

const allIcons = [
    timeRangeDark,
    timeRangeLight,
    fanPowerDark,
    fanPowerLight,
    themeDark,
    themeLight
]

function removeIcons() {
    allIcons.forEach(button => {
        button.style.display = "none"
    })
}
function loadIcons(theme) {
    removeIcons()
    if (theme === "theme-light") {
        themeDark.style.display = "block"
        fanPowerDark.style.display = "block"
        timeRangeDark.style.display = "block"
    }
    if (theme === "theme-dark") {
        themeLight.style.display = "block"
        fanPowerLight.style.display = "block"
        timeRangeLight.style.display = "block"
    }
}

// Manages theme color
function changeColorTheme() {
    currentTheme = this.getAttribute("data-theme")
    if (currentTheme === "theme-light") this.setAttribute("data-theme", "theme-dark")
    if (currentTheme === "theme-dark") this.setAttribute("data-theme", "theme-light")

    body.className = this.getAttribute("data-theme");
    localStorage.setItem("theme-color", this.getAttribute("data-theme"));
    loadIcons(localStorage.getItem("theme-color"))
}
// Load user theme-color
removeIcons()
const savedThemeColor = localStorage.getItem("theme-color");
if (savedThemeColor) {
    document.body.className = savedThemeColor;
    loadIcons(savedThemeColor)
    
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.body.className = "theme-dark";
    loadIcons("theme-dark")
} else {
    document.body.className = "theme-light"
    loadIcons("theme-light")
}
themeBtn.onclick = changeColorTheme;
/* themeDarkBtn.onclick = changeColorTheme; */