'use strict';

const { resolve } = require('path');
const { createWriteStream, existsSync } = require('fs');

function setupJsBundle (app) {
    const entryPointPath = resolve('client/index.js');
    const destinationPath = resolve('assets/static/bundle.js');
    const hasJavascriptBundle = existsSync(entryPointPath);
    const useLiveBundle = true;
    app.locals.hasJavascriptBundle = hasJavascriptBundle;

    if (hasJavascriptBundle && useLiveBundle) {
        const browserifyInc = require('browserify-incremental');
        const babelify = require('babelify');
        const envify = require('loose-envify');

        const bundler = browserifyInc(entryPointPath, { debug: true })
            .transform(babelify)
            .transform(envify);
        bundler.bundle().pipe(createWriteStream(destinationPath));
        app.use(`localhost:8080/static/bundle.js`, (req, res, next) => {
            bundler
                .bundle()
                .on('error', (err) => next(err))
                .pipe(createWriteStream(destinationPath))
                .on('finish', () => next());
        });
    }
}

module.exports = setupJsBundle;
