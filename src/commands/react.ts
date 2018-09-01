import {Command, flags} from '@oclif/command'
import {watch} from 'fs'
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
  }

  static args = [{name: 'file'}]

  baseOptions(_filename: string): webpack.Configuration {
    // const _dir = _filename.substring(0, _filename.lastIndexOf('/'))
    const _name = _filename.substring(_filename.lastIndexOf('/') + 1, _filename.indexOf('.'))
    return {
      mode: 'production',
      entry:  resolve(__dirname, _name + '.jsx'),
      output: {
        filename: _name + '.js',
        path: dirname(resolve(__dirname, _name + '.jsx'))
      },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react']
              }
            }
          }
        ]
      },
      externals: ['react', 'react-dom'],
    }
  }

  async run() {
    const {args, flags} = this.parse(React)

    watch('.', {recursive: true}, (event, filename) => {
      this.log(event)
      if (filename.endsWith('.jsx')) {
        const compiler = webpack(this.baseOptions(filename))
        compiler.run((_err, _stats) => {})
      }
    })

    // const name = flags.name || 'world'
    this.log('hello, just waiting for a .jsx file to work on')
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
