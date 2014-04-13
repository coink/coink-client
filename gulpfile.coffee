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

# misc
nodemon = require 'nodemon'
stylish = require 'jshint-stylish'
autowatch = require 'gulp-autowatch'

# paths
paths =
  vendor: './client/vendor/**/*'
  coffee: './client/**/*.coffee'
  jsx: './client/**/*.jsx'
  stylus: './client/*.styl'
  html: './client/**/*.html'
  jade: '/client/*.jade'
  config: './server/config/*.json'

# im going to break this out into a module
# so this will become about two lines
gulp.task 'server', (cb) ->
  # total hack to make nodemon + livereload
  # work sanely
  idxPath = './public/index.html'
  reloader = reload()
  nodemon
    script: './server/start.js'
    watch: ['./server']
    ext: 'js json coffee'
    ignore: ['./server/test', '.un~']

  nodemon.once 'start', cb
  nodemon.on 'start', ->
    console.log 'Server has started'
    setTimeout ->
      reloader.write path: idxPath
    , 750
  nodemon.on 'quit', ->
    console.log 'Server has quit'
  nodemon.on 'restart', (files) ->
    console.log 'Server restarted due to:', files

  return


# javascript
gulp.task 'coffee', ->
  gulp.src(paths.coffee)
    .pipe(cache('coffee'))
    .pipe(coffee())
    .pipe(gif(gutil.env.production, uglify()))
    .pipe(gulp.dest('./public'))
    .pipe reload()

gulp.task 'jade', ->
  gulp.src(paths.jade)
    .pipe(cache('jade'))
    .pipe(jade())
    .pipe(gulp.dest('./public'))
    .pipe reload()

gulp.task 'jsx', ->
  gulp.src(paths.jsx)
    .pipe(cache('jsx'))
    .pipe(react())
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(gif(gutil.env.production, uglify()))
    .pipe(gulp.dest('./public'))
    .pipe reload()

gulp.task 'config', ->
  gulp.src(paths.config)
    .pipe(cache('config'))
    .pipe(jsonlint())
    .pipe(jsonlint.reporter())

# styles
gulp.task 'stylus', ->
  gulp.src(paths.stylus)
    .pipe(stylus(use: ['nib']))
    .pipe(concat('app.css'))
    .pipe(gif(gutil.env.production, csso()))
    .pipe(gulp.dest('./public'))
    .pipe reload()

gulp.task 'html', ->
  gulp.src(paths.html)
    .pipe(cache('html'))
    .pipe(gif(gutil.env.production, htmlmin()))
    .pipe(gulp.dest('./public'))
    .pipe reload()

gulp.task 'vendor', ->
  gulp.src(paths.vendor)
    .pipe(cache('vendor'))
    .pipe(gulp.dest('./public/vendor'))
    .pipe reload()

gulp.task 'watch', ->
  autowatch gulp, paths


gulp.task 'css', ['stylus']
gulp.task 'js', ['coffee', 'jsx']
gulp.task 'static', ['html', 'vendor']
gulp.task 'default', ['js', 'css', 'static', 'server', 'config', 'watch']
