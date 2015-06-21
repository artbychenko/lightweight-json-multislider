var gulp = require('gulp');
var config = require('../config').markup;
var browserSync = require('browser-sync');
var rigger = require('gulp-rigger');

var taskDef = function () {
    return gulp.src(config.src)
		.pipe(rigger())
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
};

module.exports = taskDef;

gulp.task('markup', taskDef);
