var gulp = require('gulp');
var browserify = require('browserify');
var del = require('del');
var es = require('event-stream');
var path = require('path');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var through = require('through2');

gulp.task('assets', copyAssets);
gulp.task('sass', compileScss);
gulp.task('scripts', compileScripts);
gulp.task('build:examples', ['assets', 'sass', 'scripts']);
gulp.task('clean', cleanOutDir);
gulp.task('default', ['build:examples']);

var outDir = 'out';

function copyAssets() {
  return gulp.src(['src/examples/**/*', '!src/examples/**/*.scss', '!src/examples/**/*.js'])
    .pipe(gulp.dest(outDir));
}

function compileScss() {
  return gulp.src('src/examples/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest(outDir));
}

function compileScripts(cb) {
  var scriptStreams = [];
  var basePath = path.resolve('src/examples');
  console.log('starting gulp.src');

  gulp.src('src/examples/**/main.js')
    .pipe(through.obj(function (file) {
      var relativePath = path.dirname(file.path).substring(basePath.length);
      console.log('file=', file.path);
      var stream = browserify(file.path)
        .transform('babelify')
        .bundle()
        .on('error', function (err) {
          console.log('error occured:', err);
          this.emit('end');
        })
        .pipe(source('main.js'))
        .pipe(gulp.dest(outDir + '/' + relativePath));

      scriptStreams.push(stream);
      return stream;
    }))
    .on('end', function () {
      console.log('stream ended');
      es.merge.apply(null, scriptStreams)
        .on('end', cb);
    });
}

function cleanOutDir(cb) {
  del(outDir, cb);
}