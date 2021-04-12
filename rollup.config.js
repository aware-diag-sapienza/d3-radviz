import {terser} from 'rollup-plugin-terser'
import strip from 'rollup-plugin-strip'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import * as meta from './package.json'

const config = {
  input: 'src/index.js',
  external: Object.keys(meta.dependencies || {}).filter(key => /^d3-/.test(key)),
  output: {
    file: `dist/${meta.name}.js`,
    name: 'd3',
    format: 'umd',
    indent: false,
    extend: true,
    banner: `// ${meta.homepage} v${meta.version} Copyright ${(new Date).getFullYear()} ${meta.author}`,
    globals: Object.assign({}, ...Object.keys(meta.dependencies || {}).filter(key => /^d3-/.test(key)).map(key => ({[key]: 'd3'})))
  },
  plugins: []
}

export default 
  process.env.NODE_ENV === 'production' ? 
    [
      {
        ...config,
        plugins: [
          ...config.plugins,
          strip({functions: [ 'console.log', 'assert.*', 'debug', 'alert' ]}
          )
        ]
      },
      {
        ...config,
        output: {
          ...config.output,
          file: `dist/${meta.name}.min.js`
        },
        plugins: [
          ...config.plugins,
          strip({functions: [ 'console.log', 'assert.*', 'debug', 'alert' ]}),
          terser({
            output: {
              preamble: config.output.banner
            }
          })
        ]
      }
    ] : 
  process.env.NODE_ENV === 'development' ?
    {
      ...config,
      plugins: [
        ...config.plugins,
        serve({
          open: true,
          contentBase: ['dev', 'dist', 'node_modules']
        }),
        livereload({
          watch: ['dev', 'dist']
        })
      ]
    } : 
  config
