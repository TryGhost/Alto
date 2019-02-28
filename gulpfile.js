const gulp = require('gulp');
const {src, dest, series} = gulp;
const less = require('gulp-less');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

function css() {
  return src('assets/less/screen.less')
    .pipe(less())
    .pipe(dest('assets/css'));
}

function js() {
  return src([
    'assets/js/vendor/*',
    'assets/js/main.js'])
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(dest('assets/js'));
}

function watch() {
  gulp.watch('assets/less/**/*', css);
  gulp.watch('assets/js/main.js', js);
}

exports.default = series(css, js, watch);