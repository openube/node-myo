var path        = require('path'),
    appPath     = path.join(__dirname, '../');

var settings = {
    config:{
        'port':  1337,
        'appPath': appPath,
        'pebbleUrl': '/pebblecall'
    },
    module:{
        'express': {
            'app':null,
            'server': null
        },
        'drone' : null,
        'myo'   : null,
        'socketio' : null,
        'localtunnel': null
    }
};

module.exports = settings;