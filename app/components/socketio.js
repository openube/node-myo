var socketio    = require('socket.io');

module.exports = function(server){

    var io  = socketio.listen(server);

    io.on('connection', function(socket){
        console.log('Connection started');

        socket.on('success', function(data) {
            console.log(data);
        });

        io.on('keypress', function(data){
            if (typeof data === 'undefined') return;
            switch(data.key){
                case 't':
                    console.log('Received keypress from socket listener');
                    break;
            }
        });

    });

    return io;
};