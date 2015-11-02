var localtunnel = require('localtunnel'),
    opts        = {
                    subdomain: 'somesubdomainabc123'
                };

module.exports = function(port, subdomain){
    opts        = {
        'subdomain': subdomain
    };

    var tunnel  = localtunnel(port, opts ,function(err, tunnel) {
        if (err){
            console.log(err);
        }
        console.log('Running localtunnel',tunnel.url);
    });

    tunnel.on('close', function() {
        console.log('localtunnel closed');
    });

    return tunnel;
};
