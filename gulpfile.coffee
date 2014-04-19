# settings
path = require 'path'
express = require 'express'
EXPRESS_PORT = 3000
EXPRESS_ROOT = path.join(__dirname, "public")

# core
gulp = require 'gulp'
gutil = require 'gulp-util'

# stream utilities
gif = require 'gulp-if'
path = require 'path'

# plugins
htmlmin = require 'gulp-minify-html'
react = require 'gulp-react'
coffee = require 'gulp-coffee'
stylus = require 'gulp-stylus'
concat = require 'gulp-concat'
uglify = require 'gulp-uglify'
csso = require 'gulp-csso'
reload = require 'gulp-livereload'
cache = require 'gulp-cached'
jshint = require 'gulp-jshint'
jsonlint = require 'gulp-jsonlint'
rename = require 'gulp-rename'
notify = require 'gulp-notify'
imagemin = require 'gulp-imagemin'
filesize = require 'gulp-filesize'
changed = require 'gulp-changed'
gfilter = require 'gulp-filter'
clean = require 'gulp-clean'
autowatch = require 'gulp-autowatch'
svgmin = require 'gulp-svgmin'
seq = require 'run-sequence'

# misc
stylish = require 'jshint-stylish'

# paths
paths =
  coffee: './client/js/**/*.coffee'
  jsx: './client/js/**/*.jsx'
  js: './client/js/**/*.js'
  stylus: './client/css/**/*.styl'
  html: './client/*.html'
  css: './client/css/**/*.css'
  jade: './client/*.jade'
  png: './client/img/**/*.png'
  svg: './client/img/**/*.svg'

gulp.task 'server', ->
  app = express()
  app.use express.static(EXPRESS_ROOT)
  app.set "views", EXPRESS_ROOT
  app.set "view engine", "jade"
  app.all '/', (req, res) ->
    res.render "coink"
  app.all '*', (req, res) ->
    res.redirect "/"
  app.listen EXPRESS_PORT
  console.log "Server stared on #{EXPRESS_PORT}"

# javascript
gulp.task 'js', ->
  nonVendors = gfilter (i) -> not i.path.match /\/vendor\/[^\/]+$/
  gulp.src(paths.js)
    .pipe(cache('js'))
    .pipe(nonVendors)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(nonVendors.restore())
    .pipe(gif(gutil.env.production, uglify()))
    .pipe(gulp.dest('./public/js'))

gulp.task 'coffee', ->
  nonVendors = gfilter (i) -> not i.path.match /\/vendor\/[^\/]+$/
  gulp.src(paths.coffee)
    .pipe(cache('coffee'))
    .pipe(coffee())
    .pipe(nonVendors)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(nonVendors.restore())
    .pipe(gif('./client/js/scripts/*', jshint.reporter(stylish)))
    .pipe(gif(gutil.env.production, uglify()))
    .pipe(gulp.dest('./public/js'))

gulp.task 'jsx', ->
  gulp.src(paths.jsx)
    .pipe(cache('jsx'))
    .pipe(react())
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(gif(gutil.env.production, uglify()))
    .pipe(gulp.dest('./public/js'))

# styles
gulp.task 'stylus', ->
  gulp.src(paths.stylus)
    .pipe(gfilter((i) -> i.path.match(/styles.styl$/)))
    .pipe(stylus(use: ["nib"], "include css": true))
    .pipe(gif(gutil.env.production, csso()))
    .pipe(gulp.dest('./public/css'))

gulp.task 'css', ->
  gulp.src(paths.css)
    .pipe(gif(gutil.env.production, csso()))
    .pipe(gulp.dest('./public/css'))

# static
gulp.task 'jade', ->
  gulp.src(paths.jade)
    .pipe(cache('jade'))
    .pipe(gulp.dest('./public'))

gulp.task 'html', ->
  gulp.src(paths.html)
    .pipe(cache('html'))
    .pipe(gif(gutil.env.production, htmlmin()))
    .pipe(gulp.dest('./public'))

gulp.task 'png', ->
  return gulp.src(paths.png)
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('./public/img'))

gulp.task 'svg', ->
  return gulp.src(paths.svg)
    .pipe(cache(svgmin()))
    .pipe(gulp.dest('./public/img'))

# utils
gulp.task 'clean', ->
  gulp.src('./public', read: false)
    .pipe(clean({force: true}))

gulp.task 'watch', ->
  autowatch gulp, paths

gulp.task 'styles', ['css', 'stylus']
gulp.task 'scripts', ['js', 'coffee', 'jsx']
gulp.task 'images', ['png', 'svg']
gulp.task 'static', ['jade', 'images', 'html']
gulp.task 'default', seq('clean', ['scripts', 'styles', 'static', 'watch'], 'server')
