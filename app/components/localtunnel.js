var localtunnel = require('localtunnel'),
    opts        = {
                    subdomain: 'somesubdomainabc123'
                };

module.exports = function(settings, callback){
    opts        = {
        'subdomain': settings.config.subDomain
    };

    var tunnel  = localtunnel(settings.config.port, opts ,function(err, tunnel) {
        if (err){
            console.log(err);
        }
        console.log('Running localtunnel',tunnel.url);
        settings.module.localtunnel = tunnel;
        callback(null, tunnel);
    });

    tunnel.on('close', function() {
        console.log('localtunnel closed');
    });

    return tunnel;
};
