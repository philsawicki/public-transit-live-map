'use strict';

const cluster = require('cluster');


if (cluster.isMaster) {
    const os = require('os');

    // Create up to 4 processes to handle the requests:
    const nbCPUs = os.cpus().length;
    const maxCPUs = Math.max(nbCPUs, 4);
    for (let i = 0; i < maxCPUs; ++i) {
        cluster.fork();
    }

    // Restart the process upon crashing:
    cluster.on('exit', () => cluster.fork());
} else {
    const express = require('express');
    const { getData } = require('./data-source');

    // Configure Express server:
    const app = express();

    // Register static asset folder:
    app.use(express.static('dist'));

    // Main request handler:
    app.get('/api/bus/location/:service/:lineNumber/:direction', async (req, res) => {
        const { service, lineNumber, direction } = req.params;

        try {
            const response = await getData(service, lineNumber, direction);
            res.json(response);
        } catch (ex) {
            res.json({
                error: true,
                errorMessage: ex.message
            });
        }
    });

    const server = app.listen(3002, '0.0.0.0', () => {
        console.log('Application running on port', server.address().port);
    });
}
