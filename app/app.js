var server          = require('./components/server'),
    pebble          = require('./components/pebble'),
    localtunnel     = require('./components/localtunnel'),
    myo             = require('./components/myo'),
    drone           = require('./components/drone'),
    keypress        = require('./components/keypress'),
    socketio        = require('./components/socketio'),

    port            = 1337,
    appPath         = __dirname,
    pebbleUrl       = '/pebblecall',

    //myTunnel        = localtunnel(port, 'somesubdomain123'),
    //myDrone         = drone.connect(),
    //myMyo           = myo.connect(myDrone),
    myApp           = server.setServer(port,appPath);

//keypress.setListeners(myDrone,myMyo, myTunnel);
//pebble.setAjaxCall(myApp.app, myDrone, pebbleUrl);
socketio.connect(myApp.server);