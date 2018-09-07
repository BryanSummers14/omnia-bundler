import {Command, flags} from '@oclif/command'
import {watch} from 'fs'
import * as ora from 'ora'
import {homedir} from 'os'
import {dirname, resolve} from 'path'
import * as webpack from 'webpack'

export default class React extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
    // flag for development mode(-D, --development)
    development: flags.boolean({char: 'D'}),
    // flag for flow preset
    flow: flags.boolean({char: 'w', description: 'Adds flow configuration'})
  }

  static args = [{name: 'file'}]

  baseOptions(_filename: string) {
    const _setPresets: Array<string> = ['@babel/preset-env', '@babel/preset-react']
    const _name = _filename.substring(_filename.lastIndexOf('/') + 1, _filename.indexOf('.'))
    const envMode = React.flags.development ? {_config: 'production', _devTool: undefined} : {_config: 'development', _devTool: 'source-map'}
    if (React.flags.flow) {
      _setPresets.push('flow')
    }
    return {
      mode: envMode._config,
      entry:  resolve(homedir(), _filename),
      output: {
        filename: _name + '.js',
        path: resolve(homedir(), dirname(_filename) + '/'),
        libraryTarget: 'window'
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
                presets: [..._setPresets]
              }
            }
          }
        ]
      },
      externals: {
        react: 'React',
        'react-dom': 'ReactDOM'
      }
    }
  }

  async run() {
    const {args, flags} = this.parse(React)
    const _files: string[] = []
    watch(homedir(), {recursive: true}, (event, filename = '') => {
      if (event === 'change' && filename.endsWith('.jsx')) {
        if (_files.includes(filename)) return
        _files.push(filename)
        const options: any = this.baseOptions(filename)
        // this.log(JSON.stringify(options))
        const compiler = webpack(options)
        const spinner = ora('compiling').start()
        compiler.run((_err: any, _stats: any) => {
          if (_err) {
            this.log(_stats.toString())
            spinner.fail(_err.message)
          }
          spinner.succeed('finished')
        })
      }
    })
    setInterval(() => { _files.length = 0}, 2000)

    this.log('Watching for changes')
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
