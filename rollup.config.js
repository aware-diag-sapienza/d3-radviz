import {terser} from 'rollup-plugin-terser'
import * as meta from './package.json'

const shared_config = {
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

export default [
  shared_config,
  {
    ...shared_config,
    output: {
      ...shared_config.output,
      file: `dist/${meta.name}.min.js`
    },
    plugins: [
      ...shared_config.plugins,
      terser({
        output: {
          preamble: shared_config.output.banner
        }
      })
    ]
  }
]
