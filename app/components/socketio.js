'use strict';

const socketio    = require('socket.io');
const log         = require('custom-logger').config({ level: 0 });
const Q           = require('q');
const myo         = require('myo');

module.exports = function(settings, callback){

    const io            = socketio.listen(settings.module.express.server);
    let droneModule     = settings.module.droneModule;
    //let myo             = settings.module.myo;
    let deferred        = Q.defer();


    io.on('connection', function(socket){
        log.debug('Socketio: Started');

        socket.on('success', function(data) {
            log.info('Socketio: Connection success');
            socket.emit('console', {'data': 'Socketio: Connection success'})

            settings.module.socketio = io;
            deferred.resolve(io);
        });

        socket.on('keypress', function(action){

            log.debug(action);
            //if (!droneModule) droneModule = settings.module.droneModule;
            //if (!myo) droneModule = settings.module.myo;
            //
            if (action==='calibrate'){
                //myo.setAccelerometer();
            } else if (action ==='togglelock'){
                //myo.toggleLocked();
            } else {
               // droneModule.setRollingSpider(action);
            }
        });

    });

    deferred.promise.nodeify(callback);
    return deferred.promise;


};