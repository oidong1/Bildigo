var gulp = require('gulp'),
    coffee = require('gulp-coffee'),
    watch = require('gulp-watch');

gulp.task('coffee', function(){
    gulp.src('js/*.coffee')
        .pipe(watch())
        .pipe(coffee())
        .pipe(gulp.dest('js/'));
});
gulp.task('default', ['coffee']);
