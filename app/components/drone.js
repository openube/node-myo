'use strict';

const RollingSpider   = require('rolling-spider');
const clc             = require('cli-color');
const Q               = require('q');

let isReady         = false;
let hasTakeoff      = false;
let defaultSteps    = 5;
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
            console.log('Drone: rollingSpider connecting');
            socketio.emit('console',{'data':'Drone: rollingSpider connecting'});

            rollingSpider.setup(function() {
                rollingSpider.flatTrim();
                rollingSpider.startPing();
                rollingSpider.flatTrim();
                isReady = true;
                console.log(clc.green('Drone: rollingSpider is ready'));
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
        deferred.promise.nodeify(callback);
        return deferred.promise;
    },

    setRollingSpider : function(type, myoSteps){

        let steps = (typeof myoSteps === 'undefined') ? defaultSteps : myoSteps;
        let rollingSpider   = settings.module.drone;
        let socketio        = settings.module.socketio;

        if (!isReady) {
            console.log(clc.red('Drone: rollingSpider is NOT ready!'));
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
            console.log('drone: droneStatus =', hasTakeoff)
        } else {

            switch (type) {
                case 'up':
                    rollingSpider.up({ steps: steps});
                    socketio.emit('drone', {'data':'up'});
                    break;
                case 'down':
                    rollingSpider.down({ steps: steps});
                    socketio.emit('drone', {'data':'down'});
                    break;
                case 'left':
                    rollingSpider.left({ steps: steps});
                    break;
                case 'right':
                    rollingSpider.right({ steps: steps});
                    break;
                case 'forward':
                    rollingSpider.forward({ steps: steps});
                    socketio.emit('drone', {'data':'forward'});
                    break;
                case 'backward':
                    rollingSpider.backward({ steps: steps});
                    socketio.emit('drone', {'data':'backward'});
                    break;
                case 'tiltLeft':
                    rollingSpider.tiltLeft({ steps: steps + 2});
                    socketio.emit('drone', {'data':'tiltLeft'});
                    break;
                case 'tiltRight':
                    rollingSpider.tiltRight({ steps: steps + 2});
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