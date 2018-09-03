import {Command, flags} from '@oclif/command'
import {watch} from 'fs'
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
    force: flags.boolean({char: 'f'})
  }

  static args = [{name: 'file'}]

  getBaseOptions(_filename: string): webpack.Configuration {
    const _tempDir = _filename.split('/')
    const _newName = _tempDir[_tempDir.length - 3] // the dir of the clientlib
    return {
      mode: 'production',
      entry:  resolve(homedir(), dirname(_filename), 'main.vue.js'),
      output: {
        filename: _newName + '.js',
        path: resolve(homedir(), dirname(_filename))
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
                presets: ['@babel/preset-env']
              }
            }
          },
          {
            test: /\.css$/,
            use: ['vue-style-loader', 'css-loader']
          }
        ]
      },
      resolveLoader: {
        modules: ['node_modules']
      },
      resolve: {
        modules: ['node_modules']
      }
      plugins: [
        new VueLoaderPlugin()
      ]
    }
  }

  async run() {
    const {args, flags} = this.parse(Vue)

    const _files: string[] = []
    watch(homedir(), {recursive: true}, (event, filename = '') => {
      if (event === 'change' && filename.indexOf('node_modules') < 0 && filename.endsWith('.vue') || filename.endsWith('.vue.js')) {
        if (_files.includes(filename)) return
        _files.push(filename)
        const options = this.getBaseOptions(filename)
        const compiler = webpack(options)
        const spinner = ora('compiling').start()
        compiler.run((_err, _stats) => {
          if (_err) {
            spinner.fail(_err.message)
          }
          spinner.succeed('finished')
        })
      }
    })
    setInterval(() => { _files.length = 0}, 1500)

    this.log('hello, waiting for a .vue or .vue.js file to transpile')
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
