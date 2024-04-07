export class InfoPopup extends HTMLElement {
    constructor() {
        super()
        this.className = "info__popup"
    }

    delete() {
        this.style.animation = "slideOut 1s ease"
        setTimeout(() => this.remove(), 1500)
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

        // close button
        const closeButton = document.createElement("button")
        closeButton.className = "info__popup-btn"
        closeButton.innerHTML = "x"
        closeButton.onclick = () => this.delete()

        shadow.appendChild(link)
        shadow.appendChild(infoText)
        shadow.appendChild(closeButton)
    }
}