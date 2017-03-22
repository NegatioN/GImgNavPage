'use strict';

const express = require('express');
const nunjucks = require('nunjucks');
const nunjucksDate = require('nunjucks-date');
const path = require('path');

const events = require('./events');
const metrics = require('./metrics');

function startApp ({ eventBus }) {
    const app = express();

    const env = nunjucks.configure(path.join(__dirname, '../views'), {
        autoescape: true,
        express: app,
        throwOnUndefined: true,
        watch: true,
        noCache: false,
    });
    app.set('view engine', 'njk');

    //env.addFilter('asset', (assetPath) => assetMapper.mapAsset(assetPath));
    env.addFilter('date', nunjucksDate);

    app.get('/internal-backstage/health/readiness', (req, res) => {
        eventBus.emit(events.readinessRequest);
        res.sendStatus(204);
    });

    app.get('/internal-backstage/health/liveness', (req, res) => {
        eventBus.emit(events.livenessRequest);
        res.sendStatus(204);
    });

    app.get('/',
        (req, res) => {
            eventBus.emit(events.appRequest);
            console.log(`Hey from index via FIAAS_ENVIRONMENT "YOLO" and NODE_ENV "HEY"`);
            res.render('index', { message: 'Hello world' });
        });

    metrics.startMonitoring({ eventBus, enable: true });

    return app;
}

module.exports = startApp;
