const FS = require('fs')
const stylus = require('stylus')
const CSS = require('css')

const cwd = process.cwd()

const styles = FS.readFileSync(`${cwd}/lib/styles.styl`, 'utf8')

let cssText = stylus(styles)
  .set('filename', 'styles.css')
  .render(receiveCssText)

function receiveCssText(err, cssText) {
  if (err) { throw err }
  let cssAst = CSS.parse(cssText)

  let globalRules = []
  let docRules = []
  for (let rule of cssAst.stylesheet.rules) {
    if (rule.type === 'document') {
      docRules.push(rule)
    }
    else {
      globalRules.push(rule)
    }
  }
  let globalCss = CSS.stringify(
    {
      type: 'stylesheet',
      stylesheet: {
        rules: globalRules
      }
    },
    {
      compress: true
    }
  )

  // Naive document rule parsing
  docRules = docRules.map(rule => {
    // Parse document
    let docArg = rule.document.match(/^([a-z]+)\(([^\)]+)\)$/)
    if (!docArg) { return null }
    let [,fn, url] = docArg
    url = eval(url)
    return {
      fn,
      url,
      css: CSS.stringify(
        {
          type: 'stylesheet',
          stylesheet: {
            rules: rule.rules
          }
        },
        {
          compress: true
        }
      )
    }
  })
    .filter(Boolean)

  FS.writeFileSync(
    './lib/styles.json',
    JSON.stringify({ globalCss, docRules }, null, 2)
  )
}
