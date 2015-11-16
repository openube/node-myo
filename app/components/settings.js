var path        = require('path'),
    appPath     = path.join(__dirname, '../');

var settings = {
    config:{
        'port':  1337,
        'appPath': appPath,
        'pebbleUrl': '/pebblecall',
        'subDomain': 'hahahaha'
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
    },
    notification: {
        'pebble':{
        },
        'drone':{

        },
        'myo':{

        },
        'server':{

        }
    }
};

module.exports = settings;