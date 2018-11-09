import {Command, flags} from '@oclif/command'
import {watch} from 'fs'
import * as ora from 'ora'
import {homedir} from 'os'
import {dirname, resolve} from 'path'
import * as webpack from 'webpack'

export default class Preact extends Command {
  static description = 'describe the command here'

  static flags = {
    // flag for help flag (-h, --help)
    help: flags.help({char: 'h'}),
    // flag for development mode(-D, --development)
    development: flags.boolean({char: 'D'}),
    // flag for flow development
    flow: flags.boolean({char: 'w', description: 'Adds flow configuration'})
  }

  static args = [{name: 'file'}]

  baseOptions(_filename: string) {
    const _setPresets: Array<string> = ['@babel/preset-env']
    const _name = _filename.substring(_filename.lastIndexOf('/') + 1, _filename.indexOf('.'))
    const envMode = Preact.flags.development ? {_config: 'production', _devTool: undefined} : {_config: 'development', _devTool: 'source-map'}
    if (Preact.flags.flow) {
      _setPresets.push('flow')
    }
    return {
      mode: envMode._config,
      entry:  resolve(homedir(), _filename),
      output: {
        filename: _name + '.js',
        path: resolve(homedir(), dirname(_filename) + '/')
      },
      target: 'web',
      devtool: envMode._devTool,
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [..._setPresets],
                plugins: [
                  ['@babel/plugin-transform-react-jsx', {pragma: 'h'}]
                ]
              }
            }
          }
        ]
      },
      externals: {
        preact: 'preact'
      }
    }
  }

  async run() {
    const {/*args,*/flags} = this.parse(Preact)

    if (Boolean(flags.help)) {
      this.log(`
        AVAILABLE FLAGS:
          flow:  [-f, --flow] Indicates the transpiler to use configuration for flow development
      `)
      return
    }

    const _files: string[] = []
    watch(homedir(), {recursive: true}, (event, filename = '') => {
      if (event === 'change' && filename.endsWith('.jsx')) {
        if (_files.includes(filename)) return
        _files.push(filename)
        this.log(filename)
        const options: any = this.baseOptions(filename)
        this.log(options)
        // this.log(JSON.stringify(options))
        const compiler = webpack(options)
        const spinner = ora('compiling').start()
        compiler.run((_err: any, _stats: any) => {
          if (_err) {
            this.log(_stats.toString())
            spinner.fail(_err.message)
          }
          this.log(_stats.toString())
          spinner.succeed('finished')
        })
      }
    })
    setInterval(() => { _files.length = 0}, 2000)

    this.log('Watching for changes')
  }
}
