export class InfoPopup extends HTMLElement {
    constructor() {
        super()
        this.className = "info__popup"
    }

    delete() {
        this.style.animation = "slideOut 1s ease"
        setTimeout(() => this.remove(), 1500)
    }

    slider(elm) {
        //const REDUCE_AMOUNT = 10.5
        /* const sliderInterval = setInterval(() => {
            const rect = elm.getBoundingClientRect()
            if (rect.width > 0) {
                if (rect.width < REDUCE_AMOUNT) {
                    clearInterval(sliderInterval)
                    this.delete()
                } else {
                    elm.style.width = rect.width - REDUCE_AMOUNT + "px"
                }
            }
        }, 100) */
    }

    connectedCallback() {
        const shadow = this.attachShadow({mode:"open"})

        // info message
        const infoText = document.createElement("span")
        const text = this.getAttribute("data-text")
        infoText.innerHTML = text

        // styles
        const link = document.createElement("link")
        link.type = "text/css"
        link.setAttribute("rel", "stylesheet")
        link.setAttribute("href", "/static/css/info-popup.css")

        // creating button
        const closeButton = document.createElement("button")
        closeButton.className = "info__popup-btn"
        closeButton.innerHTML = "x"
        closeButton.onclick = () => this.delete()

        const sliderElm = document.createElement("div")
        sliderElm.className = "info__popup-slider"
        //sliderElm.onload = this.slider(sliderElm)

        shadow.appendChild(link)
        shadow.appendChild(infoText)
        shadow.appendChild(closeButton)
        //shadow.appendChild(sliderElm)
    }
}