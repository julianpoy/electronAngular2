'use strict';

// ############################################################################################
// Gulp Plugins
// ############################################################################################

var gulpPlugins = {}
gulpPlugins.filter = require('gulp-filter');
gulpPlugins.useref = require('gulp-useref');
gulpPlugins.ngAnnotate = require('gulp-ng-annotate');
gulpPlugins.uglify = require('gulp-uglify');
gulpPlugins.minifyCss = require('gulp-minify-css');
gulpPlugins.rev = require('gulp-rev');
gulpPlugins.revReplace = require('gulp-rev-replace');
gulpPlugins.rename = require("gulp-rename");
gulpPlugins.jeditor = require("gulp-json-editor");
gulpPlugins.replace = require('gulp-replace');
gulpPlugins.debug = require('gulp-debug');
gulpPlugins.gulpNpmFiles = require('gulp-npm-files');
var livereload = require('gulp-livereload');

// ############################################################################################
// Dependencies
// ############################################################################################

const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const gulpLoadPlugins = require('gulp-load-plugins');
var runSequence = require('run-sequence');

const plugins = gulpLoadPlugins();

function handleError(err) {
  console.log(err.toString());
}

// ############################################################################################
// Project Path Variables
// ############################################################################################

var yeoman = {
  app: "app",
  dist: "dist"
}

var paths = {
  scripts: [yeoman.app + '/scripts/**/*.js'],
  styles: [yeoman.app + '/styles/**/*.scss'],
  views: {
    main: yeoman.app + '/index.html',
    files: [yeoman.app + '/views/**/*.html']
  },
  sounds: {
    files: yeoman.app + '/sounds/*.*',
    dist: yeoman.dist + '/sounds/'
  },
  images: {
    files: yeoman.app + '/images/*.*',
    dist: yeoman.dist + '/images/'
  },
  electron: 'electron.js',
  tuna: 'node_modules/tunajs/tuna-min.js'
}

// ############################################################################################
// Cleanup Tasks
// ############################################################################################

gulp.task('clean:dist', function (cb) {
  return del('./dist');
});

gulp.task('clean:styles', (cb) => {
  return del([
    '**/.sass-cache/**',
    '.tmp'
  ], cb);
});

// ############################################################################################
// Move Tasks
// ############################################################################################

gulp.task('move:html', function () {
  return gulp.src(yeoman.app + '/views/**/*')
    .pipe(gulp.dest(yeoman.dist + '/views'))
    .pipe(livereload());
});

gulp.task('move:sounds', () => {
  return gulp.src(paths.sounds.files)
    .pipe(gulp.dest(paths.sounds.dist));
});

gulp.task('move:images', () => {
  return gulp.src(paths.images.files)
    .pipe(gulp.dest(paths.images.dist));
});

gulp.task('move:electron', () => {
  return gulp.src(paths.electron)
    .pipe(gulp.dest(yeoman.dist));
});

gulp.task('move:tuna', () => {
  return gulp.src(paths.tuna)
    .pipe(gulp.dest(yeoman.dist + "/scripts"));
});

gulp.task('move:package-json', () => {
  return gulp.src('package.json')
    .pipe(gulpPlugins.jeditor(function(json) {
      json.main = paths.electron;
      json.root = '.';
      return json; // must return JSON object.
    }))
    .pipe(gulp.dest(yeoman.dist));
});

gulp.task('move:index-rn', function () {
  return gulp.src("dist/index-*.html")
  .pipe(gulpPlugins.rename("index.html"))
  .pipe(gulp.dest("dist"));
});

gulp.task('move:index', ['move:index-rn'], function() {
  return del([
    'dist/index-*.html'
  ]);
});

gulp.task('move:npm-deps', function() {
  gulp.src(gulpPlugins.gulpNpmFiles(), {base:'./'}).pipe(gulp.dest(yeoman.dist));
});

// ############################################################################################
// Build Tasks
// ############################################################################################

gulp.task('build:scripts', ['move:html'], function () {
  var jsFilter = gulpPlugins.filter('**/*.js', {restore: true});
  var cssFilter = gulpPlugins.filter('**/*.css', {restore: true});

  return gulp.src(paths.views.main)
    .pipe(gulpPlugins.useref({searchPath: [yeoman.app, '.tmp'],
            transformPath: function(filePath) {
                return filePath.replace('../','')
            }}
      ))
    .pipe(jsFilter)
    .pipe(gulpPlugins.ngAnnotate())
    .pipe(gulpPlugins.debug({title: 'Compressing:'}))
    .pipe(gulpPlugins.uglify())
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(gulpPlugins.minifyCss({cache: true}))
    .pipe(cssFilter.restore)
    .pipe(gulpPlugins.rev())
    .pipe(gulpPlugins.revReplace())
    .pipe(gulp.dest(yeoman.dist));
});

gulp.task('build:scripts-dev', ['move:html'], function () {
  gulp.src(paths.views.main)
    .pipe(gulp.dest(yeoman.dist))
    .pipe(livereload());
  gulp.src(".tmp/**/*.css")
    .pipe(gulp.dest(yeoman.dist))
    .pipe(livereload());
  return gulp.src(paths.scripts)
    .pipe(gulp.dest(yeoman.dist + "/scripts/"))
    .pipe(livereload());
});

gulp.task('build:sass', () => {
  return gulp.src('app/styles/*.scss')
    .pipe(plugins.plumber())
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({
      style: 'compressed'
    })).on('error', handleError)
    .pipe(plugins.sourcemaps.write())
    .pipe(plugins.autoprefixer('last 10 versions'))
    .pipe(gulp.dest(".tmp/styles"))
    .pipe(livereload());
});

// ############################################################################################
// Watch Tasks
// ############################################################################################

gulp.task('watch-sass', () => {
  livereload.listen();
  plugins.notify('Sass Stream is Active...');
  gulp.watch('app/styles/*.scss', ['build:sass']);
  gulp.watch([paths.views.main, ".tmp/**/*.css", paths.scripts], ['build:scripts-dev']);
  gulp.watch(yeoman.app + '/views/**/*', ['move:html']);
});

// ############################################################################################
// Sequences
// ############################################################################################

gulp.task('moveDep', () => {
  runSequence(['move:npm-deps', 'move:index', 'move:images', 'move:sounds', 'move:electron', 'move:package-json', 'move:tuna']);
});

// Default Gulp Task. Run "gulp" to execute this. This will prep and build the entire app for production.
gulp.task('default', () => {
  runSequence(['clean:dist', 'clean:styles'], 'build:sass', 'build:scripts', 'moveDep');
});

// Dev Gulp Task. Run "gulp dev" to execute this. This will simply move everything, keeping files the same.
gulp.task('dev', () => {
  runSequence(['clean:dist', 'clean:styles'], 'build:sass', 'build:scripts-dev', 'moveDep', 'watch-sass');
});
