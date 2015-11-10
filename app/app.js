var
    settings        = require('./components/settings'),
    //localtunnel     = require('./components/localtunnel')(settings.port, 'somesubdomain123'),
    server          = require('./components/server')(settings),
    pebble          = require('./components/pebble'),

    myo             = require('./components/myo'),
    drone           = require('./components/drone'),
    keypress        = require('./components/keypress');
    //socketio        = require('./components/socketio')(settings);

    //myDrone         = drone.connect(settings),
    //myMyo           = myo.connect(myDrone),
    //mySocketIO      = socketio(settings);


keypress.setListeners(settings);
//pebble.setAjaxCall(server.app, myDrone, pebbleUrl);

