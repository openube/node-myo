var socketio    = require('socket.io');

module.exports = function(settings){

    var io  = socketio.listen(settings.module.express.server);

    io.on('connection', function(socket){
        console.log('Socketio started');

        socket.on('success', function(data) {
            console.log(data);
        });

        settings.module.socketio = io;

    });

    return io;
};