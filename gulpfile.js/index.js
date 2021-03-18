const gulp = require('gulp')
const $ = require('gulp-load-plugins')({ lazy: false })
const autoprefixer = require('autoprefixer')
const minimist = require('minimist')
const del = require('del')
const browserSync = require('browser-sync').create()
const strip = require('gulp-strip-comments')
const { envOptions } = require('./envOptions')

const options = minimist(process.argv.slice(2), envOptions)
// 現在開發狀態
console.log(`Current mode：${options.env}`)

function layoutHTML () {
  return gulp.src(envOptions.html.src)
    .pipe($.plumber())
    .pipe($.pug({
      pretty: true
    }))
    .pipe(gulp.dest(envOptions.html.path))
    .pipe(browserSync.reload({ stream: true }))
}

function sass () {
  const plugins = [
    autoprefixer()
  ]
  return gulp.src(envOptions.style.src)
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.postcss(plugins))
    .pipe($.if(options.env === 'dev', $.sourcemaps.write('.')))
    .pipe(gulp.dest(envOptions.style.path))
    .pipe(browserSync.reload({ stream: true }))
}

function babel () {
  return gulp.src(envOptions.javascript.src)
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(strip())
    // .pipe($.concat(envOptions.javascript.concat))
    .pipe($.if(options.env === 'dev', $.sourcemaps.write('.')))
    .pipe(gulp.dest(envOptions.javascript.path))
    .pipe(browserSync.reload({ stream: true }))
}

function vendorJs () {
  const vendorSrc = envOptions.vendors.src
  return gulp.src($.if(vendorSrc.length > 0, envOptions.vendors.src, '.'))
    .pipe($.concat(envOptions.vendors.concat))
    .pipe(gulp.dest(envOptions.vendors.path))
}

function copyImgs () {
  return gulp.src(envOptions.img.src)
    .pipe($.if(options.env === 'prod', $.image()))
    .pipe(gulp.dest(envOptions.img.path))
    .pipe(browserSync.reload({ stream: true }))
}

function browser () {
  browserSync.init({
    server: {
      baseDir: envOptions.browserDir
    },
    port: 8080
  })
}

function clean () {
  return del([envOptions.clean.src])
}

function deploy () {
  return gulp.src(envOptions.deploySrc)
    .pipe($.ghPages())
}

function watch () {
  gulp.watch(envOptions.html.src, gulp.series(layoutHTML))
  gulp.watch(envOptions.html.layoutSrc, gulp.series(layoutHTML))
  gulp.watch(envOptions.style.src, gulp.series(sass))
  gulp.watch(envOptions.javascript.src, gulp.series(babel))
  gulp.watch(envOptions.img.src, gulp.series(copyImgs))
}

exports.clean = clean
exports.deploy = deploy
exports.default = gulp.series(
  clean, layoutHTML, sass, babel, vendorJs, copyImgs, gulp.parallel(watch, browser)
)
exports.build = gulp.series(
  clean, layoutHTML, sass, babel, vendorJs, copyImgs
)
