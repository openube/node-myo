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
            'imu': 'imu',
            'toggleLock': 'toggleLock',
            'movement': {
                'left': 'left',
                'right': 'right',
                'up': 'up',
                'down': 'down',
                'forward': 'forward',
                'backward': 'backward'
            }
        },
        'server':{

        }
    }
};

module.exports = settings;