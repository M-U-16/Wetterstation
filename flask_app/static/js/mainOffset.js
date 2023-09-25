//script for setting a offset to the main element
/* const main = document.querySelector("#main") */
const navbarHeight = document.querySelector("#app__navbar").getBoundingClientRect().height
/* main.style.marginTop = `${navbarHeight}px` */
document.body.style.setProperty("--navbar-height", `${navbarHeight}px`)
