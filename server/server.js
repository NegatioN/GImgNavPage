'use strict';
const events = require('events');
const createServer = require('./lib/server-impl');

const eventBus = new events.EventEmitter();


// TODO figure out how to get metrics, so as to assess how popular it is. Add some ads, get dollas.
let server = createServer({ eventBus });
    server.listen(8080, () => {
        console.log(`Listening on port 8080`);
    })
    .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`Port 8080 is already bound, please choose another port with env PORT=$port`);
            process.exit(1);
        } else {
            throw err;
        }
    });
