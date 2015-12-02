'use strict';

const settings      = require('./components/settings');

const log           = require('custom-logger').config({ level: 0,format: "%event% %padding%[%timestamp%]: %message%",timestamp: "h:MM:ss TT" });
const commander     = require('commander');
const promise       = require('promise');
const localtunnel   = require('./components/localtunnel');
const server        = require('./components/server')(settings);
const pebble        = require('./components/pebble');
const myo           = require('./components/myo');
const drone         = require('./components/drone');
const keypress      = require('./components/keypress');
const socketio      = require('./components/socketio');

const defaultTunnel   = false;

//CLI Args
commander
    .version('1.0.0')
    .option('-l, --localtunnel <n>', 'Toggle localtunnel 1|0', parseInt)
    .parse(process.argv);

const allowTunnel = (typeof commander.localtunnel === 'undefined') ? defaultTunnel : Boolean(commander.localtunnel);

((allowTunnel)
    ? localtunnel(settings)
    : promise.resolve())
    .then(function(tunnel){
        log.info('Promise: Tunnel', (allowTunnel ? 'is enabled':'is disabled'));
        return socketio(settings)
    })
    .then(function (io) {
        log.info('Promise: Socketio has started');
        drone.connect(settings);
        return drone;
    })
    .then(function(drone){
        log.info('Promise: Drone has started');
        myo.connect(drone,settings);
        keypress.setListeners(drone,myo,settings);
        pebble.setAjaxCall(server.app, drone, settings);
    })
    .done();