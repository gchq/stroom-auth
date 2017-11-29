import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import spread from 'babel-plugin-syntax-object-rest-spread'
import spreadTransform from 'babel-plugin-transform-object-rest-spread'
import babelrc from 'babelrc-rollup'
//import npm from 'rollup-plugin-npm'


import buble from 'rollup-plugin-buble'


export default {
    output: {
        file: "dist/bundle.js",
        format: "cjs"
    },
    input: "src/main.js",
    plugins: [
        resolve(),
        commonjs(),
        buble({
                        objectAssign: 'Object.assign',
                    exclude: ['node_modules/**'],
                  })
        //buble()  // transpile ES2015+ to ES5
//	    exclude: ['node_modules/**']
//	}),
        //babel(babelrc({
        //    addModuleOptions: false,
        //    findRollupPresets: true,
        //    addExternalHelpersPlugin: false
        //})),
  //      npm()
        //spread(),
        //spreadTransform()
        
    ]
}
