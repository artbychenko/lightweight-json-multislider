var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var handleErrors = require('../util/handleErrors');
var config = require('../config').sass;
var autoprefixer = require('gulp-autoprefixer');

var taskDef = function () {
    return gulp.src(config.src)
        .pipe(sass(config.settings))
        .on('error', handleErrors)
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
};

module.exports = taskDef;

gulp.task('sass', taskDef);
