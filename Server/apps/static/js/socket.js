const socket = io()
socket.on("connect", () => {
    socket.emit("")
})
socket.on("new-readings", (data) => {
    console.log(data)
})