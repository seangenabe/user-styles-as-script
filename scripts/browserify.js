const pkg = require('../package')
const browserify = require('browserify')
const preface = require('./util/preface')
const FS = require('fs')
const ChildProcess = require('mz/child_process')
const loudRejection = require('loud-rejection')

const cwd = process.cwd()
loudRejection()

async function run() {
  const r1 = await ChildProcess.exec('git rev-list HEAD | wc -l')
  const r2 = await ChildProcess.exec('git rev-parse HEAD')
  const gitRevisionCount = r1[0].toString().trim()
  const gitCommitHash = r2[0].toString().trim()

  let b = browserify({
    basedir: 'lib',
    entries: 'index.js',
    paths: [`${cwd}/lib`],
    fullPaths: false,
    cache: {},
    packageCache: {}
  })

  b.plugin(preface, { text: `// ==UserScript==
  // @name My user styles
  // @namespace ${pkg.homepage}
  // @version ${pkg.version}.${gitRevisionCount}.r${gitCommitHash}
  // @description My user styles
  // @author ${pkg.author}
  // @include *
  // @grant
  // @downloadURL ${pkg.homepage}/index.user.js
  // @updateURL ${pkg.homepage}/index.user.js
  // @run-at document-start
  // ==/UserScript==
  ` })

  b.bundle().pipe(FS.createWriteStream(`${cwd}/dist/index.user.js`))

}

run()
