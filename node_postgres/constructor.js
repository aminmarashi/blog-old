var Connection = function (config) {
  EventEmitter.call(this)
  config = config || {}
  this.stream = config.stream || new net.Socket()
  this._keepAlive = config.keepAlive
  this.lastBuffer = false
  this.lastOffset = 0
  this.buffer = null
  this.offset = null
  this.encoding = config.encoding || 'utf8'
  this.parsedStatements = {}
  this.writer = new Writer()
  this.ssl = config.ssl || false
  this._ending = false
  this._mode = TEXT_MODE
  this._emitMessage = false
  this._reader = new Reader({
    headerSize: 1,
    lengthPadding: -4
  })
  var self = this
  this.on('newListener', function (eventName) {
    if (eventName === 'message') {
      self._emitMessage = true
    }
  })
}
