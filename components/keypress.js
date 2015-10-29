var keypress        = require('keypress');

module.exports = {
    setListeners : function(drone,myo){

        keypress(process.stdin);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.setRawMode(true);

        process.stdin.on('keypress', function (ch, key) {

            if ( !key ) return;
            console.log('Pressed =', key.name);
            switch (key.name){
                case 'q':
                case 'escape':
                    console.log('Exit');
                    process.stdin.pause();
                    process.exit();
                    break;

                case 'up':
                    break;
                case 'down':
                    break;
                case 'left':
                    break;
                case 'right':
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
                process.stdin.pause();
                process.exit();
            }
        });
    }
};