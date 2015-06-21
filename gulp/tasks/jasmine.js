var gulp = require('gulp');
var jasmine = require('gulp-jasmine-phantom');
var path = require('../config').jasmine;
gulp.task('jasmine', function () {
  return gulp.src(path.src)
         .pipe(jasmine());
});