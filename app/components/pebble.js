'use strict';

const log         = require('custom-logger');
let url, io, drone;

module.exports = {
  setAjaxCall: function(app,_drone,settings){
      url   = settings.config.pebbleUrl;
      io    = settings.module.socketio;
      drone = _drone;

      app.post(url, function (req, res) {
          let a         = req.body;
          let response  = {};

          switch (a.type) {
              case 'ping':
                  response.text = 'Success';
                  response.type = a.type;
                  log.info('Pebble: Got a ping from pebble');
                  io.emit('console',{'data': 'Pebble: Received a ping'});
                  break;
              case 'takeoff':
              case 'land':
              case 'emergency':
              case 'flipfront':
              case 'flipback':
              case 'flipleft':
              case 'flipright':
                  drone.setRollingSpider(a.type);
                  response.type = a.type;

                  log.info('Pebble: Received', a.type);
                  io.emit('console',{'data': 'Pebble: Received ' + a.type});
                  break;
              default :
                  response.text = 'Nothing to see here';
                  log.info('Error: ', response.text);
                  break;
          }
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(response));
      });
  }
};