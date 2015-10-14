import gulp from 'gulp';
import del from 'del';
import webpack from 'webpack-stream';
import named from 'vinyl-named';
import csswring from 'csswring';
import autoprefixer from 'autoprefixer';
import wct from 'web-component-tester';
import notify from 'gulp-notify';
import vulcanize from 'gulp-vulcanize';
import gulpif from 'gulp-if';
import eslint from 'gulp-eslint';
import postcss from 'gulp-postcss';
import plumber from 'gulp-plumber';
import browserSync from 'browser-sync';
import { simplaImports, name as ELEMENT_NAME } from './bower.json';
import path from 'path';


const name = 'simpla-img',
      imports = simplaImports.map(dep => `../${dep}`),
      bs = browserSync.create();

// Get WCT going
wct.gulp.init(gulp);

const options = {
        webpack: {
          module: {
            loaders: [
              { test: /\.js$/, loader: 'babel-loader' }
            ]
          }
        },
        postcss: [ csswring(), autoprefixer() ],
        vulcanize: {
          inlineCss: true,
          inlineScripts: true,
          addedImports: imports
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
          open: false
        }
      },
      errorNotifier = () => plumber({ errorHandler: notify.onError('Error: <%= error.message %>') });

gulp.task('process', () => {
  return gulp.src(['src/*/*.{html,js,css}', 'src/*.{html,js,css}'])
          .pipe(errorNotifier())
            .pipe(gulpif('*.js', named(file => {
              let name = path.basename(file.path, path.extname(file.path)),
                  parent = path.basename(path.dirname(file.path));

              return parent === 'src' ? name : path.join(parent, name);
            })))

            .pipe(gulpif('*.css', postcss(options.postcss)))

            .pipe(gulpif('*.js', eslint()))
            .pipe(gulpif('*.js', eslint.format()))
            .pipe(gulpif('*.js', eslint.failAfterError()))

            .pipe(gulpif('*.js', webpack(options.webpack)))
          .pipe(gulp.dest('.tmp'));
});

gulp.task('build', ['process'], () => {
  return gulp.src([`.tmp/${name}/${name}.html`,`.tmp/${name}.html`])
          .pipe(errorNotifier())
          .pipe(vulcanize(options.vulcanize))
          .pipe(gulp.dest('.'));
});

gulp.task('clean', () => {
  return del([ '.tmp' ]);
});

gulp.task('demo', (callback) => {
  gulp.watch('./*.{html,js}').on('change', bs.reload);

  return bs.init(options.browserSync);
});

gulp.task('test', ['build', 'test:local']);

gulp.task('watch', () => gulp.watch(['src/**/*'], ['build']));
gulp.task('default', ['build', 'demo', 'watch']);
