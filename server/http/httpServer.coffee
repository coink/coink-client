fs = require 'fs'
app = require './express'
config = require '../config'
http = require 'http'

server = http.createServer(app).listen config.port

module.exports = server
