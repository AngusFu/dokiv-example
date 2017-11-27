import { resolve } from 'path'

/**
 * Convert CommonJS modules to ES6,
 * so they can be includedin a Rollup bundle
 * SEE https://github.com/rollup/rollup-plugin-commonjs
 */
import commonjs from 'rollup-plugin-commonjs'

/**
 * Locate modules using the Node resolution algorithm,
 * for using third party modules in node_modules
 * SEE https://github.com/rollup/rollup-plugin-node-resolve
 */
import nodeResolve from 'rollup-plugin-node-resolve'

/**
 * replace loader
 */
import replace from 'rollup-plugin-replace'

/**
 * json loader
 */
import json from 'rollup-plugin-json'

/**
 * buble instead of babel(with babel-preset-env),
 * the latter is much more powerful, while the former is simpler
 */
import buble from 'rollup-plugin-buble'

/**
 * alias
 */
import alias from 'rollup-plugin-alias'

/**
 * uglify js
 */
import uglify from 'rollup-plugin-uglify'

/**
 * minify css
 * SEE http://cssnano.co/
 */
import cssnano from 'cssnano'

/**
 * autoprefixer
 */
import autoprefixer from 'autoprefixer'

/**
 * https://github.com/postcss/postcss-import
 */
import cssImport from 'postcss-import'

/**
 * postCSS loader
 */
import postCSS from 'rollup-plugin-postcss'

const bundle = {
  input: './src/index.js',
  output: {
    name: 'createApp',
    file: 'dist/bundle.js',
    format: 'iife',
    sourcemap: false,
    strict: true
  },
  plugins: [
    alias({
      'vue': resolve('./node_modules/vue/dist/vue.esm.js')
    }),
    nodeResolve({
      jsnext: true,
      main: true,
      browser: true,
      extensions: ['.js', '.json']
    }),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    json(),
    postCSS({
      plugins: [
        cssImport(),
        autoprefixer(),
        cssnano({})
      ],
      extract: 'dist/bundle.css'
    }),
    buble(),
    uglify()
  ]
}

const ssr = {
  input: './src/index.js',
  output: {
    name: 'createApp',
    file: 'dist/ssr.js',
    format: 'cjs',
    sourcemap: false,
    strict: true
  },
  external: Object.keys(require('./package.json').dependencies),
  plugins: [
    {
      load (id) {
        if (/\.css/.test(id)) {
          return ''
        }
      }
    },
    alias({
      'vue': resolve('./node_modules/vue/dist/vue.esm.js')
    }),
    nodeResolve({
      jsnext: true,
      main: true,
      browser: true,
      extensions: ['.js', '.json']
    }),
    commonjs(),
    json(),
    buble()
  ]
}

/**
 * Rollup: https://rollupjs.org/
 */
export default [bundle, ssr]
