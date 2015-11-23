var allowTunnel     = false,
    promise         = require('promise'),
    settings        = require('./components/settings'),
    localtunnel     = require('./components/localtunnel'),
    server          = require('./components/server')(settings),
    pebble          = require('./components/pebble'),
    myo             = require('./components/myo'),
    drone           = require('./components/drone'),
    keypress        = require('./components/keypress'),
    socketio        = require('./components/socketio'),
    myMyo,
    myDrone;

((allowTunnel)
    ? localtunnel(settings)
    : promise.resolve())
    .then(function(tunnel){
        console.log('Promise: Tunnel has started');
        return socketio(settings)
    })
    .then(function (io) {
        console.log('Promise: Socketio has started');
        drone.connect(settings);
        return drone;
    })
    .then(function(drone){
        console.log('Promise: Drone has started');
        myMyo = myo.connect(drone,settings);
        keypress.setListeners(drone,myo,settings);
        pebble.setAjaxCall(server.app, drone, settings);
    })
    .done();