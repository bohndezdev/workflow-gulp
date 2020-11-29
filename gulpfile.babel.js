import CONFIG from './workflow.config.json';

import gulp from 'gulp';
import babel from 'gulp-babel';
import terser from 'gulp-terser';
import concat from 'gulp-concat';
import ts from 'gulp-typescript';
import rename from 'gulp-rename'

// Para usar typescript
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import tsify from 'tsify';

// Uglify
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import buffer from 'vinyl-buffer';

// css
import postcss from 'gulp-postcss'
import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'


// Sass
import sass from 'gulp-sass'


// Clean css
import clean from 'gulp-purgecss'

// Image Min
import imagemin from 'gulp-imagemin'

const tsProject = ts.createProject('tsconfig.json')
let tasksToRun;
const cssPlugins = [
  cssnano(),
  autoprefixer()
]

gulp.task('typescript', () => {
  return tsProject
    .src()
    .pipe(tsProject())
    .js.pipe(gulp.dest(CONFIG.script_dest))
})

gulp.task("typescript-for-web", gulp.series( () => {
    return browserify({
      basedir: ".",
      debug: true,
      entries: [CONFIG.script_source_file],
      cache: {},
      packageCache: {},
    })
      .plugin(tsify)
      .transform("babelify", {
        presets: ["@babel/env"],
        extensions: [".ts", ".js"],
      })
      .bundle()
      .pipe(source(CONFIG.script_bundle_name))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
      // .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest(CONFIG.script_dest));
  })
);

gulp.task('babel-js', () => {
  return gulp
    .src(CONFIG.script_source_file)
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(terser())
    .pipe(concat(CONFIG.script_bundle_name))
    .pipe(gulp.dest(CONFIG.script_dest))
});

gulp.task('styles_css', () => {
  return gulp
    .src(CONFIG.style_source_file)
    .pipe(concat(CONFIG.style_bundle_name))
    .pipe(postcss(cssPlugins))
    .pipe(gulp.dest(CONFIG.style_dest))
})

gulp.task('styles_scss', () => {
  return gulp
    .src(CONFIG.style_source_file)
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(postcss(cssPlugins))
    .pipe(rename(CONFIG.style_bundle_name))
    .pipe(gulp.dest(CONFIG.style_dest))
})

gulp.task('clean', () => {
  return gulp
    .src(CONFIG.style_dest+'/'+CONFIG.style_bundle_name)
    .pipe(clean({
      content: ['./dist/*.php']
    }))
    .pipe(gulp.dest(CONFIG.style_dest))

})


gulp.task('imgmin', () => {
  return gulp.src('./src/img/*')
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 30, progresive: true}),
      imagemin.optipng({optimizationLevel: 1})
    ]))
    .pipe(gulp.dest('./dist/img'))
})

gulp.task('default', () => {
  /*----------  With Typescript   ----------*/
  if (CONFIG.project_type === 'web' && CONFIG.script_type === 'ts') {
    gulp.watch(CONFIG.script_source_file, gulp.series('typescript-for-web'))
    gulp.watch(CONFIG.style_source_file, gulp.series('styles_scss'))

  }
  /*----------  With Javascript   ----------*/
  else if(CONFIG.project_type === 'web' && CONFIG.script_type === 'js') {
    gulp.watch(CONFIG.script_source_file, gulp.series('babel-js'))
    gulp.watch(CONFIG.style_source_file, gulp.series('styles_scss'))

  }
  /*----------  Error   ----------*/
  else {
    console.log('==========================================')
    console.log('You have to try with a valid configuration')
    console.log('==========================================')
    return

  }
})
