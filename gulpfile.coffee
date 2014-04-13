# settings
path = require 'path'
express = require 'express'
EXPRESS_PORT = 3000
EXPRESS_ROOT = path.join(__dirname, "public")
LIVERELOAD_PORT = 35729

# core
gulp = require 'gulp'
gutil = require 'gulp-util'

# stream utilities
gif = require 'gulp-if'
path = require 'path'

# plugins
htmlmin = require 'gulp-minify-html'
react = require 'gulp-react'
jade = require 'gulp-jade'
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
clean = require 'gulp-clean'

# misc
nodemon = require 'nodemon'
stylish = require 'jshint-stylish'
autowatch = require 'gulp-autowatch'

# paths
paths =
  vendor: './client/js/vendor/**/*'
  coffee: './client/js/**/*.coffee'
  jsx: './client/js/**/*.jsx'
  js: './client/js/**/*.js'
  stylus: './client/css/*.styl'
  html: './client/*.html'
  css: './client/css/**/*.css'
  jade: './client/*.jade'
  img: './client/img/**/*'
  config: './server/config/*.json'

gulp.task 'server', () ->
  lr = require('tiny-lr')()
  lr.listen(LIVERELOAD_PORT)

  app = express()
  app.use require('connect-livereload')()
  app.use express.static(EXPRESS_ROOT)
  app.listen EXPRESS_PORT
  app.set "views", EXPRESS_ROOT
  app.set "view engine", "jade"
  app.all '/', (req, res) ->
    res.render "coink"
  app.all '*', (req, res) ->
    res.redirect "/"

# javascript
gulp.task 'js', ->
  gulp.src(paths.js)
  .pipe(cache('js'))
  .pipe(jshint())
  .pipe(jshint.reporter(stylish))
  .pipe(gif(gutil.env.production, uglify()))
  .pipe(gulp.dest('./public/js'))

gulp.task 'coffee', ->
  gulp.src(paths.coffee)
    .pipe(cache('coffee'))
    .pipe(coffee())
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
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
    .pipe(stylus(use: ['nib']))
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

gulp.task 'vendor', ->
  gulp.src(paths.vendor)
    .pipe(uglify())
    .pipe(cache('vendor'))
    .pipe(gulp.dest('./public/js/vendor'))

gulp.task 'images', ->
  return gulp.src(paths.img)
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('./public/img'))


# utils
gulp.task 'config', ->
  gulp.src(paths.config)
    .pipe(cache('config'))
    .pipe(jsonlint())
    .pipe(jsonlint.reporter('default'))

gulp.task 'clean', ->
  gulp.src('./public/*', read: false)
    .pipe(clean({force: true}))
    .pipe(notify({message: 'Cleaned /public...'}))

gulp.task 'watch', ->
  autowatch gulp, paths

gulp.task 'styles', ['css', 'stylus']
gulp.task 'scripts', ['js', 'coffee', 'jsx']
gulp.task 'static', ['jade', 'images', 'html', 'vendor']
gulp.task 'default', ['scripts', 'styles', 'static', 'server', 'config', 'watch']
