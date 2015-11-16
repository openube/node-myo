var keypress = require('keypress');

var setListeners = function(drone,myo,settings){
    var tunnel      = settings.module.localtunnel,
        socketio    = settings.module.socketio;

    keypress(process.stdin);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', function (ch, key) {

        if (!key) return;
        console.log('Pressed =', key.name);
        switch (key.name) {
            case 'q':
            case 'escape':
                console.log('Exit');
                if (tunnel) tunnel.close();
                process.stdin.pause();
                process.exit();
                break;

            case 'up':
                drone.setRollingSpider('forward');
                console.log('Forward');
                break;
            case 'down':
                drone.setRollingSpider('backward');
                console.log('Backward');
                break;
            case 'left':
                drone.setRollingSpider('left');
                console.log('Left');
                break;
            case 'right':
                drone.setRollingSpider('right');
                console.log('Right');
                break;

            case 'space':
                drone.setRollingSpider('takeoff');
                console.log('Take off');
                break;

            case 'a':
                myo.setAccelerometer();
                console.log('Calibrated = ', myo.getAccelerometer());
                break;

            case 'x':
                myo.toggleLocked();
                console.log('isLocked = ', myo.getLocked());
                break;

            case 'z' :
                drone.setRollingSpider('land');
                console.log('Land');
                break;

            case 'm':
                drone.setRollingSpider('emergency');
                console.log('Emergency');
                break;
        }

        if (key && key.ctrl && key.name == 'c') {
            console.log('Exit');
            if (tunnel) tunnel.close();
            process.stdin.pause();
            process.exit();
        }
    });
};

module.exports.setListeners = setListeners;