express = require 'express'
config = require '../config'
path = require 'path'
assets = require 'connect-assets'
jsPaths = require "connect-assets-jspaths"

app = express()
app.use express.static config.pubdir
app.listen 3000

app.use (err, req, res, next) ->
  console.error err.stack
  res.send 500, 'Something broke!'

app.use assets helperContext: app.locals, src: path.join __dirname, config.resourceDir
jsPaths assets, console.log, ((err, filePath) -> console.log "File Changed: #{filePath}"), ((err, watcher) -> console.log "Watcher initialized")
app.use "/img/", express.static path.join __dirname, config.resourceDir, "img"

module.exports = app
