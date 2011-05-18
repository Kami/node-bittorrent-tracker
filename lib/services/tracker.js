var fs = require('fs');
var path = require('path');

var express = require('express');
var sprintf = require('sprintf').sprintf;
var log = require('logmagic').local('bittorrent-tracker.lib.services.tracker');

var config = require('util/config');

var server = null;

function getHandlerModules(modulesPath) {
    var i, files, filesLen, file, module;
    var modules = [];

    files = fs.readdirSync(modulesPath);
    for (i = 0, filesLen = files.length; i < filesLen; i++) {
        file = files[i];
        try {
            module = require(path.join(modulesPath, file.replace(/\.js$/, '')));
        }
        catch (err) {
            log.error(sprintf('Unable to load "%s" module: %s', file, err.message));
            continue;
        }

        modules.push(module);
    }

    return modules;
}

function registerHandlerFunctions(server, modules) {
    var i, moduless, modulesLen, module;

    for (i = 0, modulesLen = modules.length; i < modulesLen; i++) {
        module = modules[i];
        module.register(server);
    }
}

function run() {
    var options, protocol, modules;
    var conf = config.getConfig();

    if (conf['ssl_enabled']) {
        protocol = 'https';
        options = {
            key: fs.readFileSync(conf['ssl_key']),
            cert: fs.readFileSync(conf['ssl_cert']),
            ca: fs.readFileSync(conf['ssl_ca_cert']),
            requestCert: true,
            rejectUnauthorized: false
        };

        server = express.createServer(options);
    }
    else {
        protocol = 'http';
        server = express.createServer();
    }

    // Set up middleware
    server.configure(function() {
        server.use(express.bodyParser());
    });

    // Set up routes
    modules = getHandlerModules(path.join(__dirname, '../http'));
    registerHandlerFunctions(server, modules);

    // Listen
    server.listen(conf['port'], conf['ip']);
    log.info(sprintf('Tracker started and listening at %s://%s:%s',
                     protocol, conf['ip'], conf['port']));
}

function stop() {
    if (server) {
        log.info('Stopping server...');
        server.close();
    }
}

exports.run = run;
exports.stop = stop;
