function WindowResizeManager() {
    const functionStore = []
    window.onresize = () => functionStore.forEach(func => func())

    function addFunction(func) {
        functionStore.push(func)
    }

    return {
        addFunction
    }
}

export const ResizeManager = WindowResizeManager()