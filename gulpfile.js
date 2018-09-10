/* jshint esversion : 6 */

// @root/gulpfile.js

/* @ag
  GULP SETUP
    1 -> https://gulpjs.com/
      voir les premières commandes
    2 -> https://github.com/gulpjs/gulp/tree/4.0
      -> https://github.com/gulpjs/gulp/blob/4.0/docs/API.md
*/

// ATTENTION => GULP VERSION 4
// npm i --save-dev gulp-sass gulp-babel gulp-uglify gulp-clean-css
// npm i --save-dev babel-cli babel-core babel-preset-env
// SI SOUCIS
// npm i --save-dev @babel/core @babel/cli @babel/preset-env
// SCRIPT POUR WINDOWS
/*
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "server": "nodemon ./index.js",
  "gulp": "gulp watch",
  "dev": "npm run gulp | npm run server"
}
*/

const gulp = require('gulp'); // ET SURTOUT ... SI BESOIN
const sass = require('gulp-sass'); // CHECK
const babel = require('gulp-babel'); // LA
const uglify = require('gulp-uglify'); // DOC
const cleanCSS = require('gulp-clean-css'); // OK !?

const paths = {
    styles: {
        src: 'src/styles/**/*.scss',
        dest: 'public/styles/'
    },
    scripts: {
        src: 'src/js/**/*.js',
        dest: 'public/js/'
    }
};

// /* Not all tasks need to use streams, a gulpfile is just another node program
//  * and you can use all packages available on npm, but it must return either a
//  * Promise, a Stream or take a callback and call it
//  */
// function clean() {
//   // You can use multiple globbing patterns as you would with `gulp.src`,
//   // for example if you are using del 2.0 or above, return its promise
//   return del([ 'assets' ]);
// }

/*
 * Define our tasks using plain functions
 */
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dest));
}

function watch() { // observer les changements ...
    gulp.watch(paths.scripts.src, scripts); //sur le js: callback scripts
    gulp.watch(paths.styles.src, styles); //sur les scss: callback styles
}

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 * @ag : me premier arg doit être un callback ou un
 */
const build = gulp.parallel(styles, scripts);

// on expose les tâche au CLI !
gulp.task('build', build);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('watch', watch);
// OBLIGATOIRE : Define default task called by just running `gulp`
gulp.task('default', build);
