import terser from "@rollup/plugin-terser"

const BASE_INPUT_PATH = "src/entrypoints/"
const BASE_OUTPUT_PATH = "Server/static/js/build/"

export default [
    {
        input: BASE_INPUT_PATH + "main.js",
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
    },
    {
        input: BASE_INPUT_PATH + "dashboard.chart.js",
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
]