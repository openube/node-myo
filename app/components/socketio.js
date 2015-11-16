var socketio    = require('socket.io');


module.exports = function(settings,callback){

    var io  = socketio.listen(settings.module.express.server);

    io.on('connection', function(socket){
        console.log('Socketio started');

        socket.on('success', function(data) {
            console.log('Connection success');
        });

        socket.on('keypress', function(data) {
            console.log('Socket received keypress');
        });

    });

    callback(null, io);
    return io;
};