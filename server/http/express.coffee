express = require 'express'
config = require '../config'
path = require 'path'
assets = require 'connect-assets'
jsPaths = require "connect-assets-jspaths"

app = express()
app.use express.compress()
app.use express.methodOverride()
app.use express.urlencoded()
app.use express.json()
app.use express.cookieParser config.cookieSecret
if config.cache
  app.use express.staticCache()
app.use express.static config.pubdir

app.use (err, req, res, next) ->
  console.error err.stack
  res.send 500, 'Something broke!'

app.use assets helperContext: app.locals, src: path.join __dirname, config.resourceDir
jsPaths assets, console.log, ((err, filePath) -> console.log "File Changed: #{filePath}"), ((err, watcher) -> console.log "Watcher initialized")
app.use "/img/", express.static path.join __dirname, config.resourceDir, "img"

module.exports = app
