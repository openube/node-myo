var RollingSpider   = require('rolling-spider'),
    isReady         = false,
    hasTakeoff      = false,
    defaultSteps    = 8,
    settings;

module.exports = {

    connect : function(_settings, callback){
        var rollingSpider   = new RollingSpider();

        //just for namespace
        settings = _settings;

        rollingSpider.connect(function() {
            console.log('rollingSpider connect');
            rollingSpider.setup(function() {
                rollingSpider.flatTrim();
                rollingSpider.startPing();
                rollingSpider.flatTrim();
                isReady = true;
                console.log('rollingSpider ready');

                //rollingSpider.on('battery', function () {
                //    console.log('Battery: ' + rollingSpider.status.battery + '%');
                //    rollingSpider.signalStrength(function (err, val) {
                //        console.log('Signal: ' + val + 'dBm');
                //    });
                //});

            });
        });
        settings.module.drone = rollingSpider;
        callback(null);
        return rollingSpider;
    },

    setRollingSpider : function(type, myoSteps){

        var steps = (typeof myoSteps === 'undefined') ? defaultSteps : myoSteps,
            rollingSpider   = settings.module.drone;

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
                    rollingSpider.up({ steps: steps});
                    break;
                case 'down':
                    rollingSpider.down({ steps: steps});
                    break;
                case 'left':
                    rollingSpider.left({ steps: steps});
                    break;
                case 'right':
                    rollingSpider.right({ steps: steps});
                    break;
                case 'forward':
                    rollingSpider.forward({ steps: steps});
                    break;
                case 'backward':
                    rollingSpider.backward({ steps: steps});
                    break;
                case 'tiltLeft':
                    rollingSpider.tiltLeft({ steps: steps});
                    break;
                case 'tiltRight':
                    rollingSpider.tiltRight({ steps: steps});
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
    }
};