function WindowResizeManager() {
    const functionStore = []

    window.onresize = () =>
        functionStore.forEach(func => func())

    function addFunction(func) {
        if (!window.onresize) {
            window.onresize = func
            return
        }
        functionStore.push(func)
    }
    return {
        addFunction
    }
}
export const windowManager = WindowResizeManager()