var localtunnel = require('localtunnel'),
    clc         = require('cli-color'),
    Q           = require('q');
    opts        = {
                    subdomain: 'somesubdomainabc123'
                };

module.exports = function(settings, callback){
    var deferred = Q.defer();

    opts        = {
                    'subdomain': settings.config.subDomain
                };

    var tunnel  = localtunnel(settings.config.port, opts ,function(err, tunnel) {
        if (err){
            console.log(err);
        }
        console.log(clc.blue('LocalTunnel: Running',tunnel.url));
        settings.module.localtunnel = tunnel;
        deferred.resolve(tunnel);
    });

    tunnel.on('close', function() {
        console.log(clc.green('LocalTunnel: localtunnel is closed'));
    });

    deferred.promise.nodeify(callback);
    return deferred.promise;
};
