import {Command, flags} from '@oclif/command'
import {watch} from 'fs'
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
    const _changedFileName = _filename.slice(_filename.lastIndexOf('/') + 1)
    const _tempDir = _filename.split('/')
    const _newName = _tempDir[_tempDir.length - 2]
    // const _name = _filename.substring(_filename.lastIndexOf('/') + 1, _filename.indexOf('.'))
    return {
      mode: 'production',
      entry:  resolve(__dirname, dirname(resolve(__dirname, _filename)), 'main.vue.js'),
      output: {
        filename: _newName + '.js',
        path: dirname(resolve(__dirname, dirname(resolve(__dirname, _filename)), _changedFileName))
      },
      module: {
        rules: [
          {
            test: /\.vue$/,
            loader: 'vue-loader'
          },
          {
            test: /\.js$/,
            loader: 'babel-loader'
          },
          {
            test: /\.css$/,
            use: ['vue-style-loader', 'css-loader']
          }
        ]
      },
      externals: ['vue'],
      plugins: [
        // make sure to include the plugin for the magic
        new VueLoaderPlugin()
      ]
    }
  }

  async run() {
    const {args, flags} = this.parse(Vue)

    watch('.', {recursive: true}, (event, filename) => {
      this.log(event)
      if (filename.endsWith('.vue') || filename.endsWith('.vue.js')) {
        const compiler = webpack(this.getBaseOptions(filename))
        compiler.run((_err, _stats) => {
          this.log(_stats.toString())
        })
      }
    })

    // const name = flags.name || 'world'
    this.log('hello, waiting for a .vue or .vue.js file to transpile')
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
