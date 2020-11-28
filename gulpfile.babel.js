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
    .js.pipe(gulp.dest('dist'))
})

gulp.task("typescript-for-web", gulp.series( () => {
    return browserify({
      basedir: ".",
      debug: true,
      entries: ["src/ts/main.ts"],
      cache: {},
      packageCache: {},
    })
      .plugin(tsify)
      .transform("babelify", {
        presets: ["@babel/env"],
        extensions: [".ts", ".js"],
      })
      .bundle()
      .pipe(source("bundle.js"))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest(CONFIG.script_dest));
  })
);

gulp.task('babel', () => {
  return gulp
    .src('./src/js/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(terser())
    .pipe(concat('scripts-min.js'))
    .pipe(gulp.dest('./public/js'))
});



/*----------  Tasks that will run  ----------*/
if (CONFIG.project_type == 'web' && CONFIG.script_type === 'ts') {
  tasksToRun = gulp.series('typescript-for-web')
}



gulp.task('default', () => {
  return gulp.watch('./src/ts/*.ts', tasksToRun)
})
