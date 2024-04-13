import terser from "@rollup/plugin-terser"

const BASE_INPUT_PATH = "Server/js-src/entrypoints/"
const BASE_OUTPUT_PATH = "Server/static/js/build/"

const options = {
    input: [
        "main.js",
        "d3-util.js",
        "dashboard.js",
        "dashboard.chart.js",
    ]
}

function create_rollup_conifg(options) {
    const outputConfig = options.input.map(file => {
        return {
            input: BASE_INPUT_PATH + file,
            output: [
                {
                    dir: BASE_OUTPUT_PATH + "min",
                    entryFileNames: "[name].min.js",
                    format: "iife",
                    plugins: [terser()],
                },
                {
                    dir: BASE_OUTPUT_PATH,
                    entryFileNames: "[name].js",
                    format: "iife",
                }
            ]
        }
    })

    return outputConfig
}

export default create_rollup_conifg(options)