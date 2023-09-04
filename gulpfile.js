// IMPORTS =========================================================================

//gulp
import gulp from 'gulp';
const { src, dest, watch, series, parallel } = gulp;

//Live reload
import connect from 'gulp-connect';

//path finding
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

//typescript related imports
import webpackConfig from './webpack.config.js';
import webpack from 'webpack-stream';

//sass related imports
import sassCompiler from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(sassCompiler);


// EXECUTION =======================================================================
const typescript = () => {
    return src(`${__dirname}/src/ts/*.ts`)
        .pipe(webpack(webpackConfig))
        .pipe(dest(`${__dirname}/app/js/`))
        .pipe(connect.reload())
    ;
};

const scss = () => {
    return src(`${__dirname}/src/sass/*.scss`)
        .pipe(sass())
        .pipe(dest('app/css/'))
        .pipe(connect.reload())
    ;
};

const html = () => {
    return src([`${__dirname}/src/html/*.html`, `!${__dirname}/src/html/index.html`])
        .pipe(dest('app/html/'))
        .pipe(connect.reload())
    ;
};

const html_index = () => {
    return src('src/html/index.html')
        .pipe(dest('app/'))
        .pipe(connect.reload())
    ;
};

// DEVELOPMENT =======================================================================
const start_server = () => {
    connect.server({
        port: 8080,
        root: `${__dirname}/app/`,
        base: 'http://localhost',
        livereload: true
    });
};

const monitor_source_code = () => {
    watch(`${__dirname}/src/html/index.html`, html_index);
    watch(`${__dirname}/src/html`, html);
    watch(`${__dirname}/src/sass`, scss);
    watch(`${__dirname}/src/ts`, typescript);
};

// BUILD =============================================================================

const typescript_build = () => {
    return src(`${__dirname}/src/ts/*.ts`)
        .pipe(webpack(webpackConfig))
        .pipe(dest(`${__dirname}/app/js/`))
    ;
};

const scss_build = () => {
    return src('src/sass/*.scss')
        .pipe(sass())
        .pipe(dest('app/css/'))
    ;
};

const html_build = () => {
    return src([`${__dirname}/src/html/*.html`, `!${__dirname}/src/html/index.html`])
        .pipe(dest('app/html/'))
        .pipe(connect.reload())
    ;
};

const html_index_build = () => {
    return src('src/html/index.html')
        .pipe(dest('app/'))
    ;
};

export const build = series(typescript_build, scss_build, html_build, html_index_build);

export default parallel(monitor_source_code, start_server);