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

function NewFlashedMessage(msg, category) {
    const node = document.querySelector("#flashed-msg-tmp")
    const flashedMessage = node.content
        .cloneNode(true)
        .querySelector(".flashed-message")

    flashedMessage.classList.add(category)
    flashedMessage.querySelector("p").innerHTML = msg

    document.querySelector(".flashed-messages").appendChild(flashedMessage)
    return flashedMessage
}

document.querySelectorAll(".flashed-message").forEach(
    message => addRemoveMessageListener(message)
)