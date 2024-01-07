const removeElements = (...funcs) => funcs.forEach(func => func())
const updateTooltips = (x, y, ...funcs) => funcs.forEach(func => {
    console.log(funcs)
    func(x, y)
})

function test1() { 
    console.log("test 1")
    console.log(funcs)
}
function test2() { console.log("test 2") }
function test3() { console.log("test 3") }

function testX(x,y) { console.log(x) }
function testY(x,y) { console.log(y) }

const test = {
    sayHello: () => console.log("hello")
}

test.sayHello()