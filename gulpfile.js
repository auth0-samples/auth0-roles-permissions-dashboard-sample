var gulp = require('gulp'),
    del = require('del'),
    size = require('gulp-size'),
    util = require('gulp-util'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    reactify = require('reactify'),
    minify = require('gulp-minify-css'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    buffer = require('vinyl-buffer'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    runSequence = require('run-sequence'),
    uglify = require('gulp-uglify');

var config = {
  scripts: {
    appFile: './app/scripts/app.js'
  },
	styles: {
		sourceFile: 'app/styles/main.less',
		sourceDirectory: 'app/styles/'
	},
  outputDirectory: './dist'
};

/*
 * Cleanup the output folder.
 */ 
gulp.task('clean', function(cb) {
  del(['dist'], cb);
});

/*
 * Start the webserver.
 */
gulp.task('serve', function () {
    require('./server');
});

/*
 * Compile less to css bundle.
 */
gulp.task('css', function () {
  return gulp.src(config.styles.sourceFile)
    .pipe(less())
    .pipe(rename(function(path) {
      path.basename = "styles"
    }))
    .pipe(gulp.dest(config.outputDirectory))
    .pipe(size({ title: 'css', showFiles: true }));
});

/*
 * Minify the css bundle.
 */
gulp.task('css-minify', ['css'], function() {
  return gulp.src(config.outputDirectory + '/styles.css')
    .pipe(minify())
    .pipe(rename(function(path) {
      path.extname = '.min.css';
    }))
    .pipe(gulp.dest(config.outputDirectory))
    .pipe(size({ title: 'css-minify', showFiles: true }));
});

/*
 * Recompile the css bundle when the files change.
 */
gulp.task('css-watch', ['css'], function() {
  var watcher = gulp.watch(config.styles.sourceDirectory + '*.*', ['css']);
  watcher.on('change', function(event) {
    util.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});

/*
 * Build scripts.
 */
function buildScripts(production, watch) {
  var bundler = browserify(config.scripts.appFile, {
    basedir: __dirname,
    debug: !production,
    cache: {},
    // Required for watchify.
    packageCache: {},
    // Should be true only for watchify.
    fullPaths: watch
  });

  // Enable watching.
  if (watch) {
    bundler = watchify(bundler)
  }

  // Add additional transformers.
  bundler.transform('babelify');

  // Configure bundler method.
  var run = function() {
    util.log('Bundling scripts...')

    return bundler.bundle()
      .on('error', function(err) { util.log(err); })
      .pipe(source('scripts.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(config.outputDirectory));
  };

  // Run bundler.
  bundler.on('update', run);
  return run();
}
gulp.task('js-watch', function() { 
  buildScripts(false, true); 
});
gulp.task('js', function() { 
  buildScripts(true, false); 
});

/*
 * Minify the javascript file.
 */
gulp.task('js-minify', ['js'], function() {
  return gulp.src(config.outputDirectory + '/scripts.js')
    // Breaks on windows: .pipe(uglify())
    .pipe(rename(function(path) {
      path.extname = '.min.js'
    }))
    .pipe(gulp.dest(config.outputDirectory));
});

/*
 * Tasks.
 */
gulp.task('start', function (cb) { runSequence(['css-watch', 'js-watch'], 'serve', cb); });
gulp.task('build', ['clean', 'css-minify', 'js-minify']);