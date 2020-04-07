import Koa from 'koa'
import { resolve } from 'path'
import fs, { readFileSync, writeFileSync } from 'fs'
import { exec } from 'child_process'
import webpack, { Watching } from 'webpack'
import _ from 'lodash'

const CWD = process.cwd()
const HTML_PATH = resolve(CWD, 'htmls')

interface UnitCallbacksMap {
  [desc: string]: Function;
}

const UNIT_CALLBACKS: UnitCallbacksMap = {}

type DescribeFN = (desc: string, callback: Function) => void;

export const describe: DescribeFN = (desc, callback) => {
  UNIT_CALLBACKS[desc] = callback
}

const app = new Koa()

app.use(ctx => {
  ctx.body = router(ctx.URL)
})


function router (url: URL): string {
  const { pathname, searchParams } = url
  if (pathname === '/') {
    return readFileSync(resolve(__dirname, '../index.html'), 'utf-8')
  }

  if (pathname.includes('/unit')) {
    return 'hai'
  }

  if (pathname.includes('/html')) {
    return readFileSync(resolve(HTML_PATH, searchParams.get('name') as string), 'utf-8')
  }

  if (pathname.includes('/main.js')) {
    return readFileSync(resolve(__dirname, './browser.js'), 'utf-8')
  }
  if (pathname.includes('/jquery.js')) {
    return readFileSync(resolve(__dirname, '../node_modules/jquery/dist/jquery.js'), 'utf-8')
  }

  if (pathname.includes('bundle.js')) {
    return readFileSync(resolve(__dirname, './bundle.js'), 'utf-8')
  }

  return '404'
}

// 监视
exec(`tsc ${resolve(__dirname, './browser.ts')} --watch`)
exec(`cd ${CWD} && npx tsc --watch`)
console.log(resolve(CWD, './dist'))
const SPEC_FILE_RE = /spec\.js$/

const watchFiles: Set<string> = new Set()

const build = _.debounce(() => {
  if (watchFiles.size === 0) {
    return false
  }
  const compiler = webpack({
    mode: 'development',
    entry: {
      'test': Array.from(watchFiles).map(file => resolve(CWD, './dist', file))
    },
    output: {
      filename: 'bundle.js',
      path: resolve(__dirname, '.')
    },
    devtool: '#@inline-source-map'
  })
  compiler.run((err, stat) => {
    console.log('编译好了')
  })
})

fs.watch(resolve(CWD, './dist'), (event, file) => {
  if (SPEC_FILE_RE.test(file)) {
    watchFiles.add(file)
  }
  build()
})


app.listen(3000, () => {
  console.log('启动完成')
})