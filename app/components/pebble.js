module.exports = {
  setAjaxCall: function(app,drone,settings){
      var url   = settings.config.pebbleUrl,
          io    = settings.module.socketio;

      app.post(url, function (req, res) {
          var a = req.body,
              response = {};

          switch (a.type) {
              case 'ping':
                  console.log('Got a ping from pebble');
                  //io.emit('web',{
                  //    'type': ,
                  //    'data': ''
                  //});
                  response.text = 'Success';
                  response.type = a.type;
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