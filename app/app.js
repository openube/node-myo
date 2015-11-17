var allowTunnel     = false,
    async           = require('async'),
    settings        = require('./components/settings'),
    localtunnel     = require('./components/localtunnel'),
    server          = require('./components/server')(settings),
    pebble          = require('./components/pebble'),

    myo             = require('./components/myo'),
    drone           = require('./components/drone'),
    keypress        = require('./components/keypress'),
    socketio        = require('./components/socketio'),
    myMyo,
    myDrone,
    mySocketIO,
    myLocalTunnel;

async.waterfall([
    function(callback) {
        mySocketIO  = socketio(settings, callback);
    },
    function(io, callback) {
        settings.module.socketio = io;
        if (allowTunnel){
            myLocalTunnel = localtunnel(settings,callback);
        }else{
            console.log('Async: allowTunnel is', allowTunnel);
            callback(null, null);
        }
    },
    function(tunnel, callback) {
        myDrone = drone.connect(settings, callback);
        myMyo = myo.connect(drone,settings);

        keypress.setListeners(drone,myo,settings);
        pebble.setAjaxCall(server.app, drone, settings);

    }],
    function(err,result){

});





