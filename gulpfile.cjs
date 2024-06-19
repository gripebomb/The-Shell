const gulp = require('gulp');
const { watch } = gulp;
const sourcemaps = require('gulp-sourcemaps');
const zip = require('gulp-zip');
const gulpSass = require('gulp-sass')(require('sass')); // Using 'dart-sass'
const browserSync = require('browser-sync').create();

// Use a dynamic import for gulp-autoprefixer (an ES module)
async function getAutoprefixer() {
    const module = await import('gulp-autoprefixer');
    return module.default;
}

function reload() {
    browserSync.reload();
}

async function styles() {
    const autoprefixer = await getAutoprefixer();
    
    return gulp.src('assets/scss/screen.scss')
        .pipe(sourcemaps.init())
        .pipe(gulpSass({ outputStyle: 'compressed' }).on('error', gulpSass.logError))
        .pipe(sourcemaps.write('.')) // Write sourcemaps in the same directory
        .pipe(autoprefixer({ overrideBrowserslist: ['last 2 versions'] }))
        .pipe(gulp.dest('assets/css/')) // Ensure this is the correct output path
        .pipe(browserSync.stream());
}

function release() {
    const targetDir = 'dist/';
    const themeName = require('./package.json').name;
    const filename = themeName + '.zip';

    return gulp.src([
        '**',
        '!node_modules', '!node_modules/**',
        '!dist', '!dist/**',
        '!assets/scss', '!assets/scss/**'
    ])
        .pipe(zip(filename))
        .pipe(gulp.dest(targetDir));
}

function watchFiles() {
    browserSync.init({
        proxy: "localhost:2368"
    });

    // Watch SCSS files for changes and run the styles task
    watch(['assets/scss/**/*.scss'], styles);

    // Watch HTML (or .hbs in your case) files for changes and reload
    watch(['**/*.hbs']).on('change', browserSync.reload);
}

exports.styles = styles;
exports.release = release;
exports.watch = watchFiles;
