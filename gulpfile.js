var gulp = require('gulp');
var browserify = require('browserify');
var del = require('del');
var es = require('event-stream');
var fs = require('fs');
var ghPages = require('gulp-gh-pages');
var gutil = require('gulp-util');
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
gulp.task('build:docs', buildDocumentation);
gulp.task('build', ['build:core', 'build:examples', 'build:docs']);
gulp.task('clean', cleanOutDir);
gulp.task('deploy', ['build:examples'], deployGhPages);
gulp.task('default', ['build:examples']);

var outDir = 'out';

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
  var examplesPath = 'src/examples';
  var subDirsHtml = fs.readdirSync(examplesPath).filter(function (file) {
    return fs.statSync(path.join(examplesPath, file)).isDirectory();
  }).map(function (elem) {
    return '<li><a href="' + elem + '">' + elem + '</a></li>\n';
  });

  var indexHtml = fs.readFileSync('src/examples/index.html').toString().replace(/<!-- examples -->/, subDirsHtml);

  fs.writeFileSync('out/index.html', indexHtml);
  cb();
}

function buildDocumentation() {
  return gulp.src('README.md')
    .pipe(markdown())
    .pipe(gulp.dest(outDir));
}

function deployGhPages() {
  return gulp.src(outDir + '/**')
    .pipe(ghPages());
}

function cleanOutDir(cb) {
  del([outDir, '.publish'], cb);
}