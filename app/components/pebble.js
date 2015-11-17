var url, io, drone;

module.exports = {
  setAjaxCall: function(app,_drone,settings){
      url   = settings.config.pebbleUrl;
      io    = settings.module.socketio;
      drone = _drone;

      app.post(url, function (req, res) {
          var a = req.body,
              response = {};

          switch (a.type) {
              case 'ping':
                  response.text = 'Success';
                  response.type = a.type;
                  console.log('Pebble: Got a ping from pebble');
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

                  console.log('Pebble: Received', a.type);
                  io.emit('console',{'data': 'Pebble: Received ' + a.type});
                  break;
              default :
                  response.text = 'Nothing to see here';
                  break;
          }
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(response));
      });
  }
};