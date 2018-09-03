import {Command, flags} from '@oclif/command'
import {watch} from 'fs'
import * as ora from 'ora'
import {homedir} from 'os'
import {dirname, join, resolve} from 'path'
import * as webpack from 'webpack'

export default class Preact extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  baseOptions(_filename: string): webpack.Configuration {
    const _name = _filename.substring(_filename.lastIndexOf('/') + 1, _filename.indexOf('.'))
    return {
      mode: 'production',
      entry:  resolve(homedir(), _filename),
      output: {
        filename: _name + '.js',
        path: resolve(homedir(), dirname(_filename) + '/')
      },
      target: 'web',
      module: {
        rules: [
          {
            include: [join(dirname(__filename), '../../')],
            test: /\.jsx?$/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                plugins: [
                  ['@babel/plugin-transform-react-jsx', {pragma: 'h'}]
                ]
              }
            }
          }
        ]
      },
      resolveLoader: {
        modules: [resolve(join(dirname(__filename), '../../node_modules'))],
      },
      resolve: {
        modules: ['./node_modules']
      },
      externals: {
        preact: 'preact'
      }
    }
  }

  async run() {
    const {args, flags} = this.parse(Preact)
    const _files: string[] = []
    watch(homedir(), {recursive: true}, (event, filename = '') => {
      if (event === 'change' && filename.endsWith('.jsx')) {
        if (_files.includes(filename)) return
        _files.push(filename)
        const options = this.baseOptions(filename)
        this.log(JSON.stringify(options))
        const compiler = webpack(options)
        const spinner = ora('compiling').start()
        compiler.run((_err, _stats) => {
          this.log(_stats.toString())
          if (_err) {
            spinner.fail(_err.message)
          }
          spinner.succeed('finished')
        })
      }
    })
    setInterval(() => { _files.length = 0}, 1500)

    this.log('hello, just waiting for a .jsx file to work on')
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
