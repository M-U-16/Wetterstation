//script for setting a offset to the main element
window.onload = () => {
    const main = document.querySelector("#main")
    const navbarHeight = document.querySelector("#app__navbar").getBoundingClientRect().height
    main.style.marginTop = `${navbarHeight}px`
}