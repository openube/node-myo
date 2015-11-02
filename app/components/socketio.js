var socketio = require('socket.io'),
    io;

module.exports = {
    connect : function(server){
        io  = socketio.listen(server);

        io.on('connection', function(socket){
            console.log('Connection started');

            socket.on('success', function(data) {
                console.log(data);
            });

            //drone calls

            //

        });
    },

    socketEmit : function(call,data){
        io.emit(call,data);
    }
};