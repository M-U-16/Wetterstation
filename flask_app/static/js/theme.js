const themeLightBtn = document.getElementById("theme-light");
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
    body.className = this.id;
    localStorage.setItem("theme-color", this.id);
    hasThemeLight = !hasThemeLight;
}
// Load user theme-color
removeIcons()
const savedThemeColor = localStorage.getItem("theme-color");
console.log(savedThemeColor)
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
themeLightBtn.onclick = changeColorTheme;
/* themeDarkBtn.onclick = changeColorTheme; */