// Core deps
import gulp from 'gulp';
import notify from 'gulp-notify';
import gulpif from 'gulp-if';
import filter from 'gulp-filter';
import size from 'gulp-size';
import plumber from 'gulp-plumber';
import gulprun from 'run-sequence'
import del from 'del';
import yargs from 'yargs';
import browserSync from 'browser-sync';
import wct from 'web-component-tester';

// JS
import eslint from 'gulp-eslint';
import rollup from 'gulp-rollup';
import npm from 'rollup-plugin-npm';
import commonJs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

// HTML
import vulcanize from 'gulp-vulcanize';
import minifyHTML from 'gulp-htmlmin';
import inline  from 'gulp-inline-source';

// CSS
import postcss from 'gulp-html-postcss';
import autoprefixer from 'autoprefixer';
import inputStyle from 'postcss-input-style';
import easings from 'postcss-easings';

import { componentImports, name as ELEMENT_NAME } from './bower.json';

const imports = componentImports.map(dep => `../${dep}`),
      bs = browserSync.create(),
      argv = yargs.alias('d', 'debug').boolean(['debug']).argv,
      errorNotifier = () => plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }),
      OPTIONS = {
        rollup: {
          plugins: [
            npm({ main: true }),
            commonJs(),
            babel()
          ],
          format: 'iife'
        },
        postcss: [
          autoprefixer(),
          inputStyle(),
          easings()
        ],
        vulcanize: {
          stripComments: true,
          inlineScripts: true,
          addedImports: imports
        },
        HTMLmin: {
          removeComments: true,
          removeCommentsFromCDATA: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          caseSensitive: true,
          keepClosingSlash: true,
          customAttrAssign: [/\$=/],
          minifyCSS: true,
          minifyJS: true
        },
        inline: {
          compress: false,
          swallowErrors: true
        },
        browserSync: {
          server: {
            baseDir: './',
            index: 'demo/index.html',
            routes: {
              '/': './bower_components',
              [`/${ELEMENT_NAME}.html`]: `./${ELEMENT_NAME}.html`
            }
          },
          open: false,
          notify: false
        }
      };

wct.gulp.init(gulp);

gulp.task('process', () => {
  let js = filter((file) => /\.(js)$/.test(file.path), { restore: true }),
      html = filter((file) => /\.(html)$/.test(file.path), { restore: true }),
      img = filter((file) => /\.(jpe?g|png|svg|gif)$/.test(file.path), { restore: true });

  return gulp.src(['src/**/*.{html,js,css}', 'src/*.{html,js,css}'])
          .pipe(errorNotifier())

            // JS
            .pipe(js)
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(gulpif(!argv.debug, eslint.failAfterError()))
            .pipe(rollup(OPTIONS.rollup))
            .pipe(js.restore)

            // HTML and (inline) CSS
            .pipe(html)
            .pipe(inline(OPTIONS.inline))
            .pipe(postcss(OPTIONS.postcss))
            .pipe(html.restore)

            .pipe(size({ gzip: true }))
          .pipe(gulp.dest('.tmp'));
});

gulp.task('build', ['process'], () => {
  return gulp.src([`.tmp/${ELEMENT_NAME}/${ELEMENT_NAME}.html`,`.tmp/${ELEMENT_NAME}.html`])
          .pipe(errorNotifier())
          .pipe(vulcanize(OPTIONS.vulcanize))
          .pipe(gulpif(!argv.debug, minifyHTML(OPTIONS.HTMLmin)))
        .pipe(gulp.dest('.'));
});

gulp.task('clean', () => {
  if (!argv.debug) {
    del([ '.tmp' ]);
  }
});

gulp.task('run', () => gulprun('build', 'clean'));

gulp.task('demo', (callback) => bs.init(OPTIONS.browserSync));

gulp.task('refresh', () => bs.reload());

gulp.task('test', ['run', 'test:local']);

gulp.task('watch', () => gulp.watch(['src/**/*'], () => gulprun('run', 'refresh')));

gulp.task('default', ['run', 'demo', 'watch']);
