winston = require 'winston'
config = require './config'

winston.log 'info', 'Starting with config', config

app = require './http/express'
spa = require './http/spa'
httpServer = require './http/httpServer'
views = require './http/views'

winston.log 'info', "Server running on #{config.port}"

module.exports = app
