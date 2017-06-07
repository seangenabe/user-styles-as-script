const { Transform } = require('stream')

module.exports = function preface(b, opts) {
  b.pipeline.get('wrap').push(new PrependerBrowserify(opts))
}

class PrependerBrowserify extends Transform {

  constructor(opts) {
    super(opts)
    this.text = opts.text || ''
    this.firstChunk = true
  }

  _transform(chunk, unused, next) {
    if (this.firstChunk) {
      this.push(this.text)
      this.firstChunk = false
    }
    this.push(chunk)
    next()
  }

  get label() {
    return 'prepender'
  }

}
