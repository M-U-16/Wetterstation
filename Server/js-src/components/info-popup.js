export class InfoPopup extends HTMLElement {
    constructor(category, text) {
        super()
        this.text = text
        this.category = category
    }

    connectedCallback() {
        const shadow = this.attachShadow({mode:"open"})

        const div = document.createElement("div")
        div.setAttribute("x-data", "{open: true }")
        div.setAttribute("x-show", "open")
        div.className = "flashed-message"
        div.classList.add(this.category)
        div.setAttribute("x-transition:leave.duration.200ms", "")

        // info message
        const text = document.createElement("p")
        /* const text = this.getAttribute("data-text") */
        text.innerHTML = this.text

        // close button
        const closeButton = document.createElement("button")
        closeButton.type = "button"
        closeButton.setAttribute("@click", "open=false")
        closeButton.innerHTML = "x"
        closeButton.onclick = () => this.delete()

        div.appendChild(text)
        div.appendChild(closeButton)
        shadow.appendChild(shadow)
    }
}