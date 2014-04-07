fs = require 'fs'
app = require './express'
config = require '../config'

# page.js crap
app.all '/', (req, res) ->
  res.render "coink"

app.all "*", (req, res) ->
  res.redirect "/"

module.exports = app
