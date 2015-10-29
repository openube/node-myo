var app             = require('express')(),
    bodyParser      = require('body-parser'),
    http            = require('http').Server(app);

module.exports = {
    setServer : function(port, drone){

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));

        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        app.get('/', function (req, res) {
            res.setHeader('Content-Type', 'text');
            res.send('Nothing here');

        });

        app.post('/pebblecall', function (req, res) {
            var a = req.body,
                response = {};

            switch (a.type) {
                case 'ping':
                    console.log('Got a ping from pebble');
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

        app.listen(port, function () {
            console.log('Running server at port %s', port);
        });

    }
};