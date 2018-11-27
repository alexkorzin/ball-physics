const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const gcmq = require('gulp-group-css-media-queries');
const less = require('gulp-less');
const imagemin = require('gulp-imagemin');

gulp.task('build', function(){
    gulp.src('src/less/style.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(gcmq())
        .pipe(autoprefixer({
            browsers: ['> 0.1%'],
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('production', function(){
    gulp.src(['src/**/*.*', '!**/img/**', '!**/less/**'])
        .pipe(gulp.dest('dist'))
    gulp.src('src/img/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img')) 
})

gulp.task('watch', ['browserSync'], function () {
    gulp.watch('src/less/**/*.less', ['build']);
    gulp.watch(['src/index.html', 'src/js/**/*.*'], browserSync.reload);
});

gulp.task('default', ['watch']);

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'src'
        },
        ui: {
            port: 8080
        }
    });
});