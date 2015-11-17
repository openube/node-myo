var socketio    = require('socket.io'),
    clc         = require('cli-color');

//TODO: Need to stop multiple instance callbacks

module.exports = function(settings,callback){

    var io  = socketio.listen(settings.module.express.server);

    io.on('connection', function(socket){
        console.log(clc.blue('Socketio: Started'));

        socket.on('success', function(data) {
            console.log(clc.green('Socketio: Connection success'));
            socket.emit('console', {'data': 'Socketio: Connection success'})

            settings.module.socketio = io;

        });
    });
    callback(null, io);

    return io;
};