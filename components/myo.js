var Myo             = require('myo'),
    accelerometer   = {},
    isLocked        = true,
    movementOffset  = {
        x:-0.2,
        y:-0.3
    },
    delay           = 1000,
    timeOffset      = new Date().getTime();

module.exports = {

    connect: function(drone){

        Myo.connect();
        module.exports.setListeners();

        return Myo;

    },

    setListeners : function(){
        Myo.on('connected',function(){
            console.log('Myo connected. ID:', this.name);
            console.log('----------------------------');
            this.streamEMG(true);

        });

        Myo.on('arm_synced',function(myo, data){
            console.log('Synced');
        });

        Myo.on('arm_unsynced',function(){
            console.log('Unsynced');

        });

        Myo.on('unlocked',function(){
            console.log('Unlocked');
            this.unlock();
        });

        Myo.on('double_tap', function(){
            console.log('Double tap');

        });

        Myo.on('fist', function(myo, data){
            isLocked = true;
            console.log('isLocked = ',isLocked);
        });

        Myo.on('fingers_spread', function(myo, data){
            isLocked = false;
            console.log('isLocked = ',isLocked);
        });

        Myo.on('accelerometer', function(data){
            accelerometer = data;
            if (!isLocked) {
                if ((new Date().getTime() - timeOffset) > delay) {
                    timeOffset = new Date().getTime();

                    if ((movementOffset.y - data.y) > 0.4){
                        console.log('tiltLeft');
                        drone.setRollingSpider('tiltLeft');
                    } else if ((movementOffset.y - data.y) < -0.4){
                        console.log('tiltRight');
                        drone.setRollingSpider('tiltRight');
                    }

                    if ((movementOffset.x - data.x) > 0.35){
                        console.log('move down');
                        drone.setRollingSpider('down');
                    } else if ((movementOffset.x - data.x) < -0.35){
                        console.log('move up');
                        drone.setRollingSpider('up');
                    }

                }
            }

        });
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