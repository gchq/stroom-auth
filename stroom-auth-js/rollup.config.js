import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import buble from 'rollup-plugin-buble'

export default {
    output: {
        file: "build/bundle.js",
        format: "cjs"
    },
    input: "src/index.js",
    plugins: [
        resolve(),
        commonjs(),
        buble({
            objectAssign: 'Object.assign',
             exclude: ['node_modules/**'],
        })
    ]
}
