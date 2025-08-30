function addRemoveMessageListener(node) {
   /*  let timeoutId = setTimeout(() => {
        console.log("remove")
        RemoveFlashedMessage(node)
    }, 3000)
    console.log(timeoutId) */

    node.addEventListener("remove-message", function(e) {
        e.stopPropagation()
        console.log("clear timeout")
        clearTimeout(timeoutId)
        node.addEventListener("remove-message", ()=>{})
        node.remove()
    })

}

function RemoveFlashedMessage(node) {
    node.dispatchEvent(new CustomEvent("remove-message", {
        bubbles: true
    }))
}

function NewFlashedMessage(msg, category, remove=true) {
    const node = document.querySelector("#flashed-msg-tmp")
    const flashedMessage = node.content
        .cloneNode(true)
        .querySelector(".flashed-message")

    flashedMessage.classList.add(category)
    flashedMessage.querySelector("p").innerHTML = msg

    document.querySelector(".flashed-messages").appendChild(flashedMessage)
    return flashedMessage
}

/* document.querySelectorAll(".flashed-message").forEach(
    message => addRemoveMessageListener(message)
) */