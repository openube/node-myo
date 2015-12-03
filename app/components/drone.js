'use strict';

const RollingSpider   = require('rolling-spider');
const log             = require('custom-logger').config({ level: 0 });
const Q               = require('q');
const stepsOffset     = {
    'tiltLeft'  : 2,
    'titleRight': 2,
    'forward': 8,
    'backward': 8,
    'top': 0,
    'down': 0,
    'left': 8,
    'right': 8
};

let isReady         = false;
let hasTakeoff      = false;
let defaultSteps    = 2;
let settings;

module.exports = {

    connect : function(_settings, callback){
        //just for namespace
        settings = _settings;

        let rollingSpider   = new RollingSpider();
        let socketio        = settings.module.socketio;
        let deferred        = Q.defer();
        let _this           = this;

        rollingSpider.connect(function() {
            log.debug('Drone: rollingSpider connecting');
            socketio.emit('console',{'data':'Drone: rollingSpider connecting'});

            rollingSpider.setup(function() {
                rollingSpider.flatTrim();
                rollingSpider.startPing();
                rollingSpider.flatTrim();
                isReady = true;
                log.info('Drone: rollingSpider is ready');
                socketio.emit('console',{'data':'Drone: rollingSpider is ready'});

                deferred.resolve(rollingSpider);

                //Drains battery. Better not run
                //rollingSpider.on('battery', function () {
                //    console.log('Battery: ' + rollingSpider.status.battery + '%');
                //    rollingSpider.signalStrength(function (err, val) {
                //        console.log('Signal: ' + val + 'dBm');
                //    });
                //});

            });
        });
        settings.module.drone = rollingSpider;
        settings.module.droneModule = _this;
        deferred.promise.nodeify(callback);
        return deferred.promise;
    },

    setRollingSpider : function(type, myoSteps){

        let steps = (typeof myoSteps === 'undefined') ? defaultSteps : myoSteps;
        let rollingSpider   = settings.module.drone;
        let socketio        = settings.module.socketio;

        if (!isReady) {
            log.error('Drone: rollingSpider is NOT ready!');
            socketio.emit('console',{'data':'Drone: rollingSpider is NOT ready'});
            return;
        }

        if (type == 'takeoff') {
            if (hasTakeoff) {
                hasTakeoff = false;
                rollingSpider.flatTrim();
                rollingSpider.land();
                socketio.emit('drone', {'data':'land'});
            } else {
                hasTakeoff = true;
                rollingSpider.flatTrim();
                rollingSpider.takeOff();
                socketio.emit('drone', {'data':'takeoff'});
            }
            socketio.emit('droneStatus', hasTakeoff);
            log.info('drone: droneStatus =', hasTakeoff);
        } else {

            switch (type) {
                case 'forceoff':
                    hasTakeoff = true;
                    rollingSpider.flatTrim();
                    rollingSpider.takeOff();
                    socketio.emit('drone', {'data':'takeoff'});
                    break;
                case 'up':
                    rollingSpider.up({ steps: steps + stepsOffset.up});
                    socketio.emit('drone', {'data':'up'});
                    break;
                case 'down':
                    rollingSpider.down({ steps: steps  + stepsOffset.down});
                    socketio.emit('drone', {'data':'down'});
                    break;
                case 'left':
                    rollingSpider.left({ steps: steps + stepsOffset.left});
                    break;
                case 'right':
                    rollingSpider.right({ steps: steps  + stepsOffset.right});
                    break;
                case 'forward':
                    rollingSpider.forward({ steps: steps + stepsOffset.forward});
                    socketio.emit('drone', {'data':'forward'});
                    break;
                case 'backward':
                    rollingSpider.backward({ steps: steps + stepsOffset.backward});
                    socketio.emit('drone', {'data':'backward'});
                    break;
                case 'tiltLeft':
                    rollingSpider.tiltLeft({ steps: steps + stepsOffset.tiltLeft});
                    socketio.emit('drone', {'data':'tiltLeft'});
                    break;
                case 'tiltRight':
                    rollingSpider.tiltRight({ steps: steps + stepsOffset.tiltRight});
                    socketio.emit('drone', {'data':'tiltRight'});
                    break;
                case 'hover':
                    rollingSpider.hover();
                    socketio.emit('drone', {'data':'hover'});
                    break;
                case 'land':
                    rollingSpider.land();
                    //rollingSpider.flatTrim();
                    hasTakeoff = false;
                    socketio.emit('drone', {'data':'land'});
                    socketio.emit('droneStatus', hasTakeoff);
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