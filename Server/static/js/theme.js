(() => {
    document.querySelectorAll(".app__theme-icon")
        .forEach(icon => icon.style.display = "none")

    const storeTheme = (theme) => localStorage.setItem("theme-mode", theme)
    const switchTheme = (theme) => document.body.className = theme
    const setButtonData = (theme) => button.dataset.theme = theme
    
    const getTheme = (theme) => {
        if (theme === "dark-theme") return "light-theme"
        if (theme === "light-theme") return "dark-theme"
    }

    const setIcon = (theme) => {
        console.log(theme)
        if (theme === "dark-theme") {
            
            lightThemeIcon.style.display = "none"
            darkThemeIcon.style.display = "block"
        }
        if (theme === "light-theme") {
            darkThemeIcon.style.display = "none"
            lightThemeIcon.style.display = "block"
        }
    }

    const DEFAULT_THEME = "dark-theme"
    const savedTheme = localStorage.getItem("theme-mode")
    const button = document.querySelector("#theme-switch-button")
    const theme = savedTheme ? savedTheme : DEFAULT_THEME

    const lightThemeIcon = document.querySelector("#theme-dark-icon")
    const darkThemeIcon = document.querySelector("#theme-light-icon")

    document.body.className = theme
    button.dataset.theme = theme
    
    setIcon(theme)

    button.addEventListener("click", () => {
        const newTheme = getTheme(button.dataset.theme)
        setButtonData(newTheme)
        switchTheme(newTheme)
        storeTheme(newTheme)
        setIcon(newTheme)
    }) 
})()