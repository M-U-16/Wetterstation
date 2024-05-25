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

function create_rollup_config(options) {
    let outputConfig = options.input.map(file => {
        return {
            input: BASE_INPUT_PATH + file,
            output: [
                {
                    dir: BASE_OUTPUT_PATH + "min",
                    entryFileNames: "[name].min.js",
                    format: "iife",
                    plugins: [terser()]
                },
                {
                    dir: BASE_OUTPUT_PATH,
                    entryFileNames: "[name].js",
                    format: "iife",
                },
                /* {
                    dir: BASE_OUTPUT_PATH + "umd",
                    entryFileNames: "[name].umd.js",
                    name: "testlib",
                    format: "umd"
                } */
            ]
        }
    })

    outputConfig.push({
        input: ["Server/js-src/chart/index.js"],
        output: [
            {
                file: BASE_OUTPUT_PATH + "umd/" + "chart.lib.js",
                format: "umd",
                name: "chart", // this is the name of the global object
                esModule: false,
                exports: "named",
                sourcemap: true,
            },
            {
                file: BASE_OUTPUT_PATH + "umd/" + "chart.lib.min.js",
                format: "umd",
                name: "chart", // this is the name of the global object
                esModule: false,
                exports: "named",
                sourcemap: true,
                plugins: [terser()]
            }
        ]
    })

    return outputConfig
}

export default create_rollup_config(options)