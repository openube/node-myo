var RollingSpider   = require('rolling-spider'),
    isReady         = false,
    hasTakeoff      = false,
    rollingSpider   = new RollingSpider();

module.exports = {

    connect : function(){

        rollingSpider.connect(function() {
            console.log('rollingSpider connect');
            rollingSpider.setup(function() {
                rollingSpider.flatTrim();
                rollingSpider.startPing();
                rollingSpider.flatTrim();
                isReady = true;
                console.log('rollingSpider ready');
            });
        });

        return rollingSpider;
    },

    setRollingSpider : function(type){
        if (!isReady) {
            console.log('rollingSpider is not ready!');
            return;
        }

        if (type == 'takeoff') {
            if (hasTakeoff) {
                hasTakeoff = false;
                rollingSpider.flatTrim();
                rollingSpider.land();
            } else {
                hasTakeoff = true;
                rollingSpider.flatTrim();
                rollingSpider.takeOff();
            }
        } else {

            switch (type) {
                case 'up':
                    rollingSpider.up({ steps: 2});
                    break;
                case 'down':
                    rollingSpider.down({ steps: 2});
                    break;
                case 'tiltLeft':
                    rollingSpider.tiltLeft({ steps: 2});
                    break;
                case 'tiltRight':
                    rollingSpider.tiltRight({ steps: 2});
                    break;
                case 'land':
                    rollingSpider.land();
                    rollingSpider.flatTrim();
                    hasTakeoff = false;
                    break;
                case 'flipfront':
                    rollingSpider.frontFlip();
                    break;
                case 'flipback':
                    rollingSpider.backFlip();
                    break;
                case 'flipleft':
                    rollingSpider.leftFlip();
                    break;
                case 'flipright':
                    rollingSpider.rightFlip();
                    break;
                case 'emergency':
                    rollingSpider.emergency();
                    hasTakeoff = true;
                    break;
                default:
                    break;

            }
        }
    },

    getIsReady: function(){
        return isReady;
    },

    getHasTakeoff: function(){
        return hasTakeoff;
    }
};