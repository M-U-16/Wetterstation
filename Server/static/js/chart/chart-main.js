const controller = chartController()
controller.drawFirstCharts()

window.onresize = () => controller.resizeAll()