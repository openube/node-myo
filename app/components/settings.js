'use strict';

const path        = require('path');
const appPath     = path.join(__dirname, '../');

var settings = {
    config:{
        'port':  1337,
        'appPath': appPath,
        'pebbleUrl': '/pebblecall',
        'subDomain': 'whitemanjuu'
    },
    module:{
        'express': {
            'app':null,
            'server': null
        },
        'drone' : null,
        'droneModule' : null,
        'myo'   : null,
        'socketio' : null,
        'localtunnel': null
    }
};

module.exports = settings;