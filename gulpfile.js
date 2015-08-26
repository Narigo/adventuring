var gulp = require('gulp');
var browserify = require('browserify');
var del = require('del');
var es = require('event-stream');
var fs = require('fs');
var ghPages = require('gulp-gh-pages');
var gutil = require('gulp-util');
var inject = require('gulp-inject');
var markdown = require('gulp-markdown');
var path = require('path');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var through = require('through2');

gulp.task('assets', copyAssets);
gulp.task('sass', compileScss);
gulp.task('scripts', compileScripts);
gulp.task('build:core', ['assets', 'sass', 'scripts']);
gulp.task('build:examples', ['build:core'], buildIndexFile);
gulp.task('build', ['build:core', 'build:examples']);
gulp.task('clean', cleanOutDir);
gulp.task('deploy', ['build:examples'], deployGhPages);
gulp.task('default', ['build:examples']);

var outDir = 'out';
var ghPagesDir = '.publish';

function copyAssets() {
  return gulp.src(['src/examples/**/*', '!src/examples/index.html', '!src/examples/**/*.scss', '!src/examples/**/*.js'])
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

  gulp.src('src/examples/**/main.js')
    .pipe(through.obj(function (file, enc, callback) {
      var relativePath = path.dirname(file.path).substring(basePath.length);

      var stream = browserify(file.path)
        .transform('babelify')
        .bundle()
        .on('error', gutil.log)
        .pipe(source('main.js'))
        .pipe(gulp.dest(outDir + '/' + relativePath))

      scriptStreams.push(stream);

      callback();
    }))
    .on('data', gutil.log)
    .on('end', function () {
      es.merge.apply(null, scriptStreams)
        .on('end', cb);
    });
}

function buildIndexFile(cb) {
  return gulp.src('src/index.html')
    // Examples
    .pipe(inject(gulp.src('src/examples/**/index.html').pipe(markdown()), {
      starttag : '<!-- inject:examples -->',
      transform : function (filePath, file) {
        // return file contents as string
        console.log(nameFromPath(file.relative));
        return '<li><a href="' + file.relative + '">' + nameFromPath(file.relative) + '</a></li>';
      }
    }))
    // Documentation
    .pipe(inject(gulp.src('README.md').pipe(markdown()), {
      starttag : '<!-- inject:docs -->',
      transform : function (filePath, file) {
        // return file contents as string
        return file.contents.toString('utf8');
      }
    }))
    .pipe(gulp.dest(outDir));

  function nameFromPath(relativePath) {
    return relativePath.substring(0, relativePath.indexOf('/')).replace(/-/g, ' ');
  }
}

function deployGhPages() {
  return gulp.src(outDir + '/**')
    .pipe(ghPages({
      cacheDir : ghPagesDir
    }));
}

function cleanOutDir(cb) {
  del([outDir, ghPagesDir], cb);
}