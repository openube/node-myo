'use strict';

const socketio    = require('socket.io');
const clc         = require('cli-color');
const Q           = require('q');

module.exports = function(settings, callback){

    const io            = socketio.listen(settings.module.express.server);
    let droneModule     = settings.module.droneModule;
    let myo             = settings.module.myo;
    let deferred        = Q.defer();


    io.on('connection', function(socket){
        console.log(clc.blue('Socketio: Started'));

        socket.on('success', function(data) {
            console.log(clc.green('Socketio: Connection success'));
            socket.emit('console', {'data': 'Socketio: Connection success'})

            settings.module.socketio = io;
            deferred.resolve(io);
        });

        socket.on('keypress', function(action){

            console.log(action);
            //if (!droneModule) droneModule = settings.module.droneModule;
            //if (!myo) droneModule = settings.module.myo;
            //
            if (action==='calibrate'){
                myo.setAccelerometer();
            } else if (action ==='togglelock'){
                myo.toggleLocked();
            } else {
               // droneModule.setRollingSpider(action);
            }
        });

    });

    deferred.promise.nodeify(callback);
    return deferred.promise;


};