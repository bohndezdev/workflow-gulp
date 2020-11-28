import CONFIG from './workflow.config.json';

import  gulp from 'gulp';
import  babel from 'gulp-babel';
import  terser from 'gulp-terser';
import  concat from 'gulp-concat';
import  ts from 'gulp-typescript';

// Para usar typescript
import  browserify from 'browserify';
import  source from 'vinyl-source-stream';
import  tsify from 'tsify';

// Uglify
import  uglify from 'gulp-uglify';
import  sourcemaps from 'gulp-sourcemaps';
import  buffer from 'vinyl-buffer';


const tsProject = ts.createProject('tsconfig.json')
let tasksToRun;


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
      entries: [CONFIG.script_source_name],
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
    .src(CONFIG.script_source_name)
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(terser())
    .pipe(concat(CONFIG.script_bundle_name))
    .pipe(gulp.dest(CONFIG.script_dest))
});

gulp.task('default', () => {
  /*----------  For Web   ----------*/
  if (CONFIG.project_type === 'web' && CONFIG.script_type === 'ts') {
    return gulp.watch(CONFIG.watch_dir, gulp.series('typescript-for-web'))
  } else if(CONFIG.project_type === 'web' && CONFIG.script_type === 'js') {
    return gulp.watch(CONFIG.watch_dir, gulp.series('babel-js'))
  } else {
    console.log('==========================================')
    console.log('You have to try with a valid configuration')
    console.log('==========================================')
    return
  }

})
