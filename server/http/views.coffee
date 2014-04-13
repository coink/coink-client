app = require './express'
config = require '../config'
path = require 'path'

app.set "views", path.join __dirname, config.resourceDir
app.set "view engine", "jade"

module.exports = app
