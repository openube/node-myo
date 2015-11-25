'use strict';

const commander     = require('commander');
const promise       = require('promise');
const settings      = require('./components/settings');
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
        myo.connect(drone,settings);
        keypress.setListeners(drone,myo,settings);
        pebble.setAjaxCall(server.app, drone, settings);
    })
    .done();