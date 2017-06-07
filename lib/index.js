const insertCss = require('insert-css')

const domain = document.domain

const styles = require('./styles.json')

insertCss(styles.globalCss)

for (let rule of styles.docRules) {
  let url = rule.url
  let css = rule.css
  let fn = rule.fn
  if (fn === 'domain' && domain !== url ||
      fn === 'regexp' && domain.match(url) == null) {
    continue
  }
  persistCss(css)
}

// Persist style element
function persistCss(css) {
  insertCss(css)
  setTimeout(
    () => {
      let styles = [...document.querySelectorAll('style')]
      if (!styles.some(st => st.textContent !== css)) {
        insertCss(css)
      }
    },
    5000
  )
}
