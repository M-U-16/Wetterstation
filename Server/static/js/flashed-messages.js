function addRemoveMessageListener(node) {
    console.log(node)
    node.addEventListener("remove-message", (e) => {
        e.stopPropagation()
        node.addEventListener("remove-message", ()=>{})
        node.remove()
    })
}

function RemoveFlashedMessage(node) {
    node.dispatchEvent(new CustomEvent("remove-message", {
        bubbles: true
    }))
}

class InfoPopup extends HTMLElement {
    constructor(category, text) {
        super()
        this.text = text
        this.category = category
    }

    

    connectedCallback() {
        let popup = this
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
        //closeButton.setAttribute("@click", "open=false")
        closeButton.setAttributeNS
        closeButton.innerHTML = "x"
        closeButton.onclick = function() {
            popup.remove()
        }
        div.appendChild(text)
        div.appendChild(closeButton)
        shadow.appendChild(div)
    }
}

const messages = document.querySelectorAll(".flashed-message")
messages.forEach(message => addRemoveMessageListener(message))