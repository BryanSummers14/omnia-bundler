import {Command, flags} from '@oclif/command'
import {existsSync, watch} from 'fs'
import * as ora from 'ora'
import {homedir} from 'os'
import {dirname, resolve} from 'path'
import {VueLoaderPlugin} from 'vue-loader'
import * as webpack from 'webpack'

export default class Vue extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
    // flag for configuration for the vue property decorator (-p)
    'prop-decorator': flags.boolean({char: 'p'})
  }

  static args = [{name: 'file'}]

  resolveEntry(_filename: string): string {
    let entryFile = ''
    let depthCheck = ''
    let dirDepth = 3 // Setting max dir depth at 3
    while (dirDepth !== 0) {
      const tempFile = resolve(homedir(), dirname(_filename), depthCheck + 'main.vue.js')
      if (existsSync(tempFile)) {
        entryFile = tempFile
        break
      }
      --dirDepth
      depthCheck += '../'
    }
    return entryFile
  }

  getBaseOptions(_filename: string): webpack.Configuration {
    const _entryFile = this.resolveEntry(_filename)
    if (_entryFile.length === 0) {
      throw new Error('main.vue.js file not found from path: ' + _filename)
    }
    const propPlugin = Vue.flags['prop-decorator']
            ?
            [
                ['@babel/plugin-proposal-decorators', {legacy: true}],
                ['@babel/plugin-proposal-class-properties']
            ]
            : []
    return {
      mode: 'production',
      entry:  _entryFile,
      output: {
        filename:  'vue.compiled.js',
        path: resolve(dirname(_entryFile)),
        libraryTarget: 'window'
      },
      resolve: {
        extensions: ['.js', '.vue']
      },
      module: {
        rules: [
          {
            test: /\.vue$/,
            loader: 'vue-loader'
          },
          {
            test: /\.js$/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                plugins: propPlugin
              }
            }
          },
          {
            test: /\.css$/,
            use: ['vue-style-loader', 'css-loader']
          }
        ]
      },
      externals: {
        vue: 'Vue'
      },
      plugins: [
        new VueLoaderPlugin()
      ]
    }
  }

  async run() {
    const {args, flags} = this.parse(Vue)

    if (flags.help) {
      this.log(`
        AVAILABLE FLAGS:
          prop-decorator:  [-p, --prop-decorator] Indicates the transpiler to use configuration for vue-property-decorators. More information can be found: https://github.com/kaorun343/vue-property-decorator
      `)
      return
    }

    const _files: string[] = []
    watch(homedir(), {recursive: true}, (event, filename = '') => {
      if (event === 'change' && filename.indexOf('node_modules') < 0 && filename.endsWith('.vue') || filename.endsWith('.vue.js')) {
        if (_files.includes(filename)) return
        _files.push(filename)
        const options = this.getBaseOptions(filename)
        // this.log(JSON.stringify(options))
        const compiler = webpack(options)
        const spinner = ora('compiling').start()
        compiler.run((_err, _stats) => {
          if (_err) {
            this.log(_stats.toString())
            spinner.fail(_err.message)
          }
          spinner.succeed('finished')
        })
      }
    })
    setInterval(() => { _files.length = 0}, 2000)

    this.log('Ready')
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
