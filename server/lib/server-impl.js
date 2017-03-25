'use strict';

const express = require('express');
const nunjucks = require('nunjucks');
const nunjucksDate = require('nunjucks-date');
const path = require('path');

const events = require('./events');
const metrics = require('./metrics');
const setupBundle = require('./setup-bundle');

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
    app.use(express.static('assets'));
    setupBundle(app);

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
            res.render('index');
        });

    metrics.startMonitoring({ eventBus, enable: true });

    return app;
}

module.exports = startApp;
