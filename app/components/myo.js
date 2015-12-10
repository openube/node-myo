'use strict';

const Myo             = require('myo');
const log             = require('custom-logger').config({ level: 0 });
const _               = require('lodash');
const imuDelay        = 250;
const delay           = 250;
const alpha           = 0.5;
const M_PI            = 3.14159265358979323846264338327950288;

let accelerometer   = {};
let isLocked        = true;
//let movementOffset  = {
//    x:-0.2,
//    y:-0.3
//};
let movementOffset  = 35;
let timeOffset      = new Date().getTime();
let imuOffset       = new Date().getTime();

let fXg             = 0;
let fYg             = 0;
let fZg             = 0;

module.exports = {

    connect: function(drone,settings){
        let  socketio = settings.module.socketio;
        Myo.connect();

        Myo.on('connected',function(){
            log.info('Myo: Connected. ID:', this.name);
            log.info('----------------------------');
            this.streamEMG(true);

        });

        Myo.on('arm_synced',function(myo, data){
            log.debug('Myo: Synced');
            socketio.emit('console', {'data':'Myo: Synced'})
        });

        Myo.on('arm_unsynced',function(){
            log.debug('Myo: Unsynced');
            socketio.emit('console', {'data':'Myo: Unsynced'})

        });

        Myo.on('unlocked',function(){
            log.debug('Myo: Unlocked');
            socketio.emit('console', {'data':'Myo: Unlocked'});
            this.unlock();
        });

        Myo.on('double_tap', function(){
            log.debug('Myo: Double tap');
            socketio.emit('console', {'data':'Myo: Double tap'});
        });

        Myo.on('fist', function(myo, data){
            isLocked = true;
            log.warn('Myo: isLocked = ',isLocked);
            socketio.emit('console', {'data':'Myo: isLocked = ' + isLocked});
        });

        Myo.on('fingers_spread', function(myo, data){
            isLocked = false;
            log.info('Myo: isLocked = ',isLocked);
            socketio.emit('console', {'data':'Myo: isLocked = ' + isLocked});
        });

        Myo.on('imu', function(raw){
            let data    = raw.accelerometer;
            let roll    = 0;
            let pitch   = 0;

            accelerometer = data;



            fXg = data.x * alpha + (fXg * (1.0 - alpha));
            fYg = data.y * alpha + (fYg * (1.0 - alpha));
            fZg = data.z * alpha + (fZg * (1.0 - alpha));

            roll  = Math.round((Math.atan2(-fYg, fZg)*180.0)/M_PI);
            pitch = Math.round((Math.atan2(fXg, Math.sqrt(fYg*fYg + fZg*fZg))*180.0)/M_PI);

            //accelerometer.movement.roll = roll;
            //accelerometer.movement.pitch = pitch;

            if ((new Date().getTime() - imuOffset) > imuDelay) {
                imuOffset = new Date().getTime();
                let movement = {'movement':{'roll':roll, 'pitch':pitch}};
                let newRaw = raw;
                _.assign(newRaw, movement);
                socketio.emit('imu', {'data':newRaw});
            }

            if (!isLocked) {
                if ((new Date().getTime() - timeOffset) > delay) {
                    timeOffset = new Date().getTime();
                    if(!socketio) socketio = settings.module.socketio;

                    //Roll
                    if (roll > 0 && roll > movementOffset){
                        log.debug('Myo: Tilt left');
                        //socketio.emit('drone',{'data':'tiltLeft'});
                        socketio.emit('console', {'data':'Myo: Tilt left'});
                        drone.setRollingSpider('tiltLeft');
                    } else if (roll < 0 && roll < -movementOffset){
                        log.debug('Myo: Tilt right');
                        //socketio.emit('drone',{'data':'tiltRight'});
                        socketio.emit('console', {'data':'Myo: Tilt right'});
                        drone.setRollingSpider('tiltRight');
                    }

                    //Pitch
                    if (pitch > 0 && pitch > movementOffset){
                        log.debug('Myo: Move up');
                        //socketio.emit('drone',{'data':'up'});
                        socketio.emit('console', {'data':'Myo: Move up'});
                        drone.setRollingSpider('up');
                    } else if (pitch < 0 && pitch < -movementOffset){
                        log.debug('Myo: Move down');
                        //socketio.emit('drone',{'data':'down'});
                        socketio.emit('console', {'data':'Myo: Move down'});
                        drone.setRollingSpider('down');
                    }

                    /*
                        Deprecated function. Calculating pitch and roll in real time
                        instead manually offset-ing via a fixed accelerometer location
                    */
                    //if ((movementOffset.y - data.y) > 0.4){
                    //    log.debug('Myo: Tilt left');
                    //    //socketio.emit('drone',{'data':'tiltLeft'});
                    //
                    //    socketio.emit('console', {'data':'Myo: Tilt left'});
                    //    drone.setRollingSpider('tiltLeft');
                    //} else if ((movementOffset.y - data.y) < -0.4){
                    //    log.debug('Myo: Tilt right');
                    //    //socketio.emit('drone',{'data':'tiltRight'});
                    //
                    //    socketio.emit('console', {'data':'Myo: Tilt right'});
                    //    drone.setRollingSpider('tiltRight');
                    //}
                    //
                    //if ((movementOffset.x - data.x) > 0.35){
                    //    log.debug('Myo: Move down');
                    //    //socketio.emit('drone',{'data':'down'});
                    //
                    //    socketio.emit('console', {'data':'Myo: Move down'});
                    //    drone.setRollingSpider('down');
                    //} else if ((movementOffset.x - data.x) < -0.35){
                    //    log.debug'Myo: Move up');
                    //    //socketio.emit('drone',{'data':'up'});
                    //
                    //    socketio.emit('console', {'data':'Myo: Move up'});
                    //    drone.setRollingSpider('up');
                    //}

                }
            }

        });


        return Myo;

    },

    getAccelerometer : function(){
        return accelerometer;
    },

    setAccelerometer : function(){
        log.error('Myo.setAccelerometer()is deprecated. Gestures are now calculated in real time');
        movementOffset = accelerometer;
    },

    getLocked: function(){
        return isLocked;
    },

    toggleLocked: function(bool){
        isLocked = (typeof bool === 'undefined') ? !isLocked : bool;
    }
};