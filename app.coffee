express = require "express"
path = require "path"
http = require "http"
stylus = require "stylus"
assets = require "connect-assets"
jsPaths = require "connect-assets-jspaths"

app = express()

app.set "views", path.join __dirname, "views"
app.set "view engine", "jade"

app.use express.logger()
app.use assets helperContext: app.locals, src: path.join __dirname, "resources", "public"
jsPaths assets, console.log, ((err, filePath) -> console.log "File Changed: #{filePath}"), ((err, watcher) -> console.log "Watcher initialized")
app.use "/img/", express.static path.join __dirname, "resources", "public", "img"

app.all "/", (req, res) -> res.render "coink"
app.all "*", (req, res) -> res.redirect "/"

server = http.createServer app
server.listen 3000
