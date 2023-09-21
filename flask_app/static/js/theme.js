const themeLightBtn = document.getElementById("theme-light");
const themeDarkBtn = document.getElementById("theme-dark");
let hasThemeLight = body.classList.contains("theme-light");
// Manages theme color
function changeColorTheme() {
    body.className = this.id;
    localStorage.setItem("theme-color", this.id);
    hasThemeLight = !hasThemeLight;
    console.log("hello")
}

function changeIconColor() {
    const timeRangeBtn = document.getElementById()
}

// Load user theme-color
const savedThemeColor = localStorage.getItem("theme-color");
console.log(savedThemeColor)
if (savedThemeColor) {
    document.body.className = savedThemeColor;
} else {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.body.className = "theme-dark";
    } else {
        document.body.className = "theme-light";
    }
}

themeLightBtn.onclick = changeColorTheme;
themeDarkBtn.onclick = changeColorTheme;