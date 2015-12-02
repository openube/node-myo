'use strict';
const localtunnel = require('localtunnel');
const log         = require('custom-logger').config({ level: 0 });
const Q           = require('q');
let  opts         = {
                    subdomain: 'somesubdomainabc123'
                };

module.exports = function(settings, callback){
     let deferred = Q.defer();

    opts        = {
                    'subdomain': settings.config.subDomain
                };

    let tunnel  = localtunnel(settings.config.port, opts ,function(err, tunnel) {
        if (err){
            log.warn(err);
        }
        log.info('LocalTunnel: Running',tunnel.url);
        settings.module.localtunnel = tunnel;
        deferred.resolve(tunnel);
    });

    tunnel.on('close', function() {
        log.warn('LocalTunnel: localtunnel is closed');
    });

    deferred.promise.nodeify(callback);
    return deferred.promise;
};
