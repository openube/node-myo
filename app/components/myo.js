var Myo             = require('myo'),
    clc             = require('cli-color'),
    accelerometer   = {},
    isLocked        = true,
    movementOffset  = {
        x:-0.2,
        y:-0.3
    },
    delay           = 1000,
    timeOffset      = new Date().getTime(),
    imuOffset       = new Date().getTime();

module.exports = {

    connect: function(drone,settings){
        var socketio = settings.module.socketio;
        Myo.connect();

        Myo.on('connected',function(){
            console.log(clc.blue('Myo: Connected. ID:', this.name));
            console.log(clc.blue('----------------------------'));
            this.streamEMG(true);

        });

        Myo.on('arm_synced',function(myo, data){
            console.log('Myo: Synced');
            socketio.emit('console', {'data':'Myo: Synced'})
        });

        Myo.on('arm_unsynced',function(){
            console.log('Myo: Unsynced');
            socketio.emit('console', {'data':'Myo: Unsynced'})

        });

        Myo.on('unlocked',function(){
            console.log(clc.green('Myo: Unlocked'));
            socketio.emit('console', {'data':'Myo: Unlocked'});
            this.unlock();
        });

        Myo.on('double_tap', function(){
            console.log('Myo: Double tap');
            socketio.emit('console', {'data':'Myo: Double tap'});
        });

        Myo.on('fist', function(myo, data){
            isLocked = true;
            console.log(clc.red('Myo: isLocked = ',isLocked));
            socketio.emit('console', {'data':'Myo: isLocked = ' + isLocked});
        });

        Myo.on('fingers_spread', function(myo, data){
            isLocked = false;
            console.log(clc.green('Myo: isLocked = ',isLocked));
            socketio.emit('console', {'data':'Myo: isLocked = ' + isLocked});
        });

        Myo.on('imu', function(raw){
            var data = raw.accelerometer;
            accelerometer = data;

            if ((new Date().getTime() - imuOffset) > 250) {
                imuOffset = new Date().getTime();
                socketio.emit('imu', {'data':raw});
            }

            if (!isLocked) {
                if ((new Date().getTime() - timeOffset) > delay) {
                    timeOffset = new Date().getTime();
                    if(!socketio) socketio = settings.module.socketio;
                    if ((movementOffset.y - data.y) > 0.4){
                        console.log('Myo: Tilt left');
                        socketio.emit('console', {'data':'Myo: Tilt left'});
                        drone.setRollingSpider('tiltLeft');
                    } else if ((movementOffset.y - data.y) < -0.4){
                        console.log('Myo: Tilt right');
                        socketio.emit('console', {'data':'Myo: Tilt right'});
                        drone.setRollingSpider('tiltRight');
                    }

                    if ((movementOffset.x - data.x) > 0.35){
                        console.log('Myo: Move down');
                        socketio.emit('console', {'data':'Myo: Move down'});
                        drone.setRollingSpider('down');
                    } else if ((movementOffset.x - data.x) < -0.35){
                        console.log('Myo: Move up');
                        socketio.emit('console', {'data':'Myo: Move up'});
                        drone.setRollingSpider('up');
                    }

                }
            }

        });


        return Myo;

    },

    getAccelerometer : function(){
        return accelerometer;
    },

    setAccelerometer : function(){
        movementOffset = accelerometer;
    },

    getLocked: function(){
        return isLocked;
    },

    toggleLocked: function(bool){
        isLocked = (typeof bool === 'undefined') ? !isLocked : bool;
    }
};