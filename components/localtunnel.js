var localtunnel = require('localtunnel'),
    opts        = {
        subdomain: 'whitemanjuu'
    };

module.exports = {
    init: function(port, subdomain){
        opts        = {
            'subdomain': subdomain
        };
        var tunnel = localtunnel(port, opts ,function(err, tunnel) {
            if (err){
                console.log(err);
            }
            console.log('Running localtunnel:',tunnel.url);
        });

        tunnel.on('close', function() {
            // tunnels are closed
            console.log('localtunnel closed');
        });
    }
};
