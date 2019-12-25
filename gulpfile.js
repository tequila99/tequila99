const { src, dest, task, series, watch, parallel } = require("gulp");
const rm = require("gulp-rm");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const sassGlob = require("gulp-sass-glob");
const autoprefixer = require("gulp-autoprefixer");
const px2rem = require('gulp-smile-px2rem');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglyfy = require('gulp-uglyfly');
const svgo = require('gulp-svgo');
const svgSprite = require('gulp-svg-sprite');
const gulpif = require('gulp-if');

const { DIST_PATH, SRC_PATH, STYLES_LIBS, JS_LIBS } = require('./gulp.config');

const reload = browserSync.reload;

sass.compiler = require("node-sass");

const env = process.env.NODE_ENV;


task("clean", () => {
  return src(`${DIST_PATH}/**/*`, { read: false }).pipe(rm());
});

task("copy:html", () => {
  return src(`${SRC_PATH}/*.html`)
    .pipe(dest(DIST_PATH))
    .pipe(reload({ stream: true }));
});

task("copy:img", () => {
  return src([
    `${SRC_PATH}/images/**/*.png`,
    `${SRC_PATH}/images/**/*.jpg`,
    `${SRC_PATH}/images/**/*.jpeg`
  ])
    .pipe(dest(`${DIST_PATH}/images/`))
    .pipe(reload({ stream: true }));
});

task("styles", () => {
  return src([...STYLES_LIBS, `${SRC_PATH}/styles/main.scss`])
    .pipe(gulpif(env==='dev',sourcemaps.init()))
    .pipe(concat("main.min.scss"))
    .pipe(sassGlob())
    .pipe(sass().on("error", sass.logError))
    .pipe(px2rem({
      dpr: 1,
      rem: 16,
      one: false
    }))
    .pipe(gulpif(env === 'prod',
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false
      }))
    )
    .pipe(gulpif(env==='prod',gcmq()))
    .pipe(gulpif(env==='prod', cleanCSS()))
    .pipe(gulpif(env==='dev',sourcemaps.write()))
    .pipe(dest(DIST_PATH))
    .pipe(reload({ stream: true }));
});

task("scripts", () => {
  return src([...JS_LIBS, `${SRC_PATH}/scripts/*.js`])
    .pipe(gulpif(env==='dev',sourcemaps.init()))
    .pipe(concat('main.min.js'))
    .pipe(gulpif(env==='prod', babel({
      presets: ['@babel/env']
    })))
    .pipe(gulpif(env==='prod',uglyfy()))
    .pipe(gulpif(env==='dev',sourcemaps.write()))
    .pipe(dest(DIST_PATH))
    .pipe(reload({stream: true}));
});

task('icons', () => {
  return src(`${SRC_PATH}/images/icons/*.svg`)
    .pipe(
      svgo({
        plugins: [
          {
            removeAttrs: { attrs: '(fill|stroke"style"width"height"data.*)' }
          }
        ]
      })
    )
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(dest(`${DIST_PATH}/images/icons`))
    .pipe(reload({stream: true}));
});

task("server", () => {
  browserSync.init({
    server: {
      baseDir: `./${DIST_PATH}`
    },
    open: false
  });
});

task('watch', () => {
  watch(`${SRC_PATH}/styles/**/*.scss`, series("styles"));
  watch(`${SRC_PATH}/*.html`, series("copy:html"));
  watch(`${SRC_PATH}/scripts/**/*.js`, series('scripts'));
  watch(`${SRC_PATH}/images/icons/*.svg`, series('icons'));
  watch(`${SRC_PATH}/images/**/*.(png|jpg|jpeg)`, series('copy:img'))
})

task(
  "default", 
  series(
    "clean", 
    parallel("copy:html", "copy:img","styles", "scripts", "icons"),
    parallel('watch', "server")
  )
);

task(
  "build", 
  series(
    "clean", 
    parallel("copy:html", "copy:img","styles", "scripts", "icons")
  )
);