'use strict';
const keypress    = require('keypress');
const log         = require('custom-logger').config({ level: 0,format: "%event% %padding%[%timestamp%]: %message%" });

var setListeners = function(drone,myo,settings){
    let tunnel      = settings.module.localtunnel;
    let socketio    = settings.module.socketio;

    keypress(process.stdin);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', function (ch, key) {

        if (!key) return;
        if (!socketio) socketio = settings.module.socketio;
        log.debug('Key pressed =', key.name);
        switch (key.name) {
            case 'q':
            case 'escape':
                log.info('Key: Exit');
                if (tunnel) tunnel.close();
                process.stdin.pause();
                process.exit();
                break;

            case 'up':
                drone.setRollingSpider('forward');
                log.debug('Key: Forward');
                break;
            case 'down':
                drone.setRollingSpider('backward');
                log.debug('Key: Backward');
                break;
            case 'left':
                drone.setRollingSpider('left');
                log.debug('Key: Left');
                break;
            case 'right':
                drone.setRollingSpider('right');
                log.debug('Key: Right');
                break;

            case 'space':
                drone.setRollingSpider('takeoff');
                //socketio.emit('drone',{'data':'takeoff'});
                log.debug('Key: Take off');
                break;

            case 't':
                drone.setRollingSpider('forceoff');
                log.debug('Key: Force take off');
                break;

            case 'h':
                drone.setRollingSpider('hover');
                //socketio.emit('drone',{'data':'hover'});
                log.debug('Key: Hover');
                break;

            case 'b':
                drone.setRollingSpider('flipback');
                //socketio.emit('drone',{'data':'flipback'});
                log.debug('Key: flipback');
                break;

            case 'a':
                myo.setAccelerometer();
                log.debug('Key: Calibrated = ', myo.getAccelerometer());
                socketio.emit('console',{'data':'Key: Calibrated Myo'});
                break;

            case 'x':
                myo.toggleLocked();
                log.debug('Key: isLocked = ', myo.getLocked());
                break;

            case 'z' :
                drone.setRollingSpider('land');
                //socketio.emit('drone',{'data':'land'});
                log.debug('Key: Land');
                break;

            case 'm':
                drone.setRollingSpider('emergency');
                log.warn('Key: Emergency');
                break;
        }

        if (key && key.ctrl && key.name == 'c') {
            log.warn('Key: Exit');
            if (tunnel) tunnel.close();
            process.stdin.pause();
            process.exit();
        }
    });
};

module.exports.setListeners = setListeners;