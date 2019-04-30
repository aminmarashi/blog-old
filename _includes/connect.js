Connection.prototype.connect = function (port, host) {
  if (this.stream.readyState === 'closed') {
    this.stream.connect(port, host)
  } else if (this.stream.readyState === 'open') {
    this.emit('connect')
  }

  var self = this

  this.stream.on('connect', function () {
    if (self._keepAlive) {
      self.stream.setKeepAlive(true)
    }
    self.emit('connect')
  })

  const reportStreamError = function (error) {
    // don't raise ECONNRESET errors - they can & should be ignored
    // during disconnect
    if (self._ending && error.code === 'ECONNRESET') {
      return
    }
    self.emit('error', error)
  }
  this.stream.on('error', reportStreamError)

  this.stream.on('close', function () {
    self.emit('end')
  })

  if (!this.ssl) {
    return this.attachListeners(this.stream)
  }

  this.stream.once('data', function (buffer) {
    var responseCode = buffer.toString('utf8')
    switch (responseCode) {
      case 'N': // Server does not support SSL connections
        return self.emit('error', new Error('The server does not support SSL connections'))
      case 'S': // Server supports SSL connections, continue with a secure connection
        break
      default: // Any other response byte, including 'E' (ErrorResponse) indicating a server error
        return self.emit('error', new Error('There was an error establishing an SSL connection'))
    }
    var tls = require('tls')
    self.stream = tls.connect({
      socket: self.stream,
      servername: host,
      checkServerIdentity: self.ssl.checkServerIdentity || tls.checkServerIdentity,
      rejectUnauthorized: self.ssl.rejectUnauthorized,
      ca: self.ssl.ca,
      pfx: self.ssl.pfx,
      key: self.ssl.key,
      passphrase: self.ssl.passphrase,
      cert: self.ssl.cert,
      secureOptions: self.ssl.secureOptions,
      NPNProtocols: self.ssl.NPNProtocols
    })
    self.attachListeners(self.stream)
    self.stream.on('error', reportStreamError)

    self.emit('sslconnect')
  })
}
