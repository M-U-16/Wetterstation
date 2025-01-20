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

const messages = document.querySelectorAll(".flashed-message")
messages.forEach(message => addRemoveMessageListener(message))