var keypress    = require('keypress'),
    clc         = require('cli-color');

var setListeners = function(drone,myo,settings){
    var tunnel      = settings.module.localtunnel,
        socketio    = settings.module.socketio;

    keypress(process.stdin);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', function (ch, key) {

        if (!key) return;
        if (!socketio) socketio = settings.module.socketio;
        console.log('Key pressed =', key.name);
        switch (key.name) {
            case 'q':
            case 'escape':
                console.log(clc.red('Key: Exit'));
                if (tunnel) tunnel.close();
                process.stdin.pause();
                process.exit();
                break;

            case 'up':
                drone.setRollingSpider('forward');
                console.log('Key: Forward');
                break;
            case 'down':
                drone.setRollingSpider('backward');
                console.log('Key: Backward');
                break;
            case 'left':
                drone.setRollingSpider('left');
                console.log('Key: Left');
                break;
            case 'right':
                drone.setRollingSpider('right');
                console.log('Key: Right');
                break;

            case 'space':
                drone.setRollingSpider('takeoff');
                socketio.emit('drone',{'data':'takeoff'});
                console.log('Key: Take off');
                break;

            case 'h':
                drone.setRollingSpider('hover');
                socketio.emit('drone',{'data':'hover'});
                console.log('Key: Hover');
                break;

            case 'b':
                drone.setRollingSpider('flipback');
                socketio.emit('drone',{'data':'flipback'});
                console.log('Key: flipback');
                break;

            case 'a':
                myo.setAccelerometer();
                console.log('Key: Calibrated = ', myo.getAccelerometer());
                socketio.emit('console',{'data':'Key: Calibrated Myo'});
                break;

            case 'x':
                myo.toggleLocked();
                console.log('Key: isLocked = ', myo.getLocked());
                break;

            case 'z' :
                drone.setRollingSpider('land');
                socketio.emit('drone',{'data':'land'});
                console.log('Key: Land');
                break;

            case 'm':
                drone.setRollingSpider('emergency');
                console.log(clc.red('Key: Emergency'));
                break;
        }

        if (key && key.ctrl && key.name == 'c') {
            console.log(clc.red('Key: Exit'));
            if (tunnel) tunnel.close();
            process.stdin.pause();
            process.exit();
        }
    });
};

module.exports.setListeners = setListeners;