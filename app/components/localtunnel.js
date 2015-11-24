'use strict';
const localtunnel = require('localtunnel');
const clc         = require('cli-color');
const Q           = require('q');
const opts        = {
                    subdomain: 'somesubdomainabc123'
                };

module.exports = function(settings, callback){
     let deferred = Q.defer();

    opts        = {
                    'subdomain': settings.config.subDomain
                };

    let tunnel  = localtunnel(settings.config.port, opts ,function(err, tunnel) {
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
