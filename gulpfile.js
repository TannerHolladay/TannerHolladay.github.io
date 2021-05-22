const gulp = require('gulp');
const csso = require('gulp-csso');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const cp = require('child_process');
const log = require('fancy-log');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync');

const jekyllCommand = (/^win/.test(process.platform)) ? 'jekyll.bat' : 'bundle';

/*
 * Build the Jekyll Site
 * runs a child process in node that runs the jekyll commands
 */
gulp.task('jekyll-build', (done) => {
    return cp.spawn(jekyllCommand, ['exec', 'jekyll', 'build'], {stdio: 'inherit'}).on('close', done);
});

/*
 * Rebuild Jekyll & reload browserSync
 */
gulp.task('jekyll-rebuild', gulp.series('jekyll-build', (done) => {
    browserSync.reload()
    done();
}));

/*
 * Build the jekyll site and launch browser-sync
 */
gulp.task('browser-sync', gulp.series('jekyll-build', (done) => {
    browserSync({
        port: 4000,
        server: {
            baseDir: '_site'
        }
    })
    done();
}));

/*
* Compile and minify sass
*/
gulp.task('sass', (done) => {
    log("test");
    gulp.src('src/styles/**/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(csso())
        .pipe(gulp.dest('assets/css/'))
    done();
});

/*
* Compile fonts
*/
gulp.task('fonts', (done) => {
    gulp.src('src/fonts/**/*.{ttf,woff,woff2}')
        .pipe(plumber())
        .pipe(gulp.dest('assets/fonts/'))
    done();
});

/*
 * Minify images
 */
gulp.task('imagemin', (done) => {
    return gulp.src('src/img/**/*.{jpg,png,gif}')
        .pipe(plumber())
        .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))
        .pipe(gulp.dest('assets/img/')).on('close', done);
});

/**
 * Compile and minify js
 */
gulp.task('js', (done) => {
    return gulp.src('src/js/**/*.js')
        .pipe(plumber())
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('assets/js/')).on('close', done);
});

gulp.task('watch', (done) => {
    gulp.watch('./src/js/**/*.js', {usePolling: true}, gulp.series('js', 'jekyll-rebuild'));
    gulp.watch('./src/styles/**/*.scss', {usePolling: true}, gulp.series('sass', 'jekyll-rebuild'));
    gulp.watch('./src/fonts/**/*.{tff,woff,woff2}', {usePolling: true}, gulp.series('fonts'));
    gulp.watch('./src/img/**/*.{jpg,png,gif}', {usePolling: true}, gulp.series('imagemin'));
    gulp.watch(['./*html', './_includes/*html', './_layouts/*.html'], {usePolling: true}, gulp.series('jekyll-rebuild'));
    gulp.watch('./_config.yml', {usePolling: true}, gulp.series('jekyll-rebuild'));
    done();
});

gulp.task('default', gulp.series('js', 'sass', 'fonts', 'browser-sync', 'watch'));
