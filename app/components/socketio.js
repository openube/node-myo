var socketio    = require('socket.io'),
    clc         = require('cli-color');

//TODO: Need to stop multiple instance callbacks

module.exports = function(settings,callback){

    var io  = socketio.listen(settings.module.express.server),
        droneModule = settings.module.droneModule,
        myo = settings.module.myo;


    io.on('connection', function(socket){
        console.log(clc.blue('Socketio: Started'));

        socket.on('success', function(data) {
            console.log(clc.green('Socketio: Connection success'));
            socket.emit('console', {'data': 'Socketio: Connection success'})

            settings.module.socketio = io;
        });

        socket.on('keypress', function(action){
            //if (!droneModule) droneModule = settings.module.droneModule;
            //if (!myo) droneModule = settings.module.myo;
            //
            //if (action==='calibrate'){
            //    myo.setAccelerometer();
            //} else if (action ==='togglelock'){
            //    myo.toggleLocked();
            //} else {
            //   // droneModule.setRollingSpider(action);
            //}
        });

    });
    callback(null, io);

    return io;
};