var app             = require('express')(),
    bodyParser      = require('body-parser'),
    http            = require('http').Server(app);

module.exports = {
    setServer : function(port){
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));

        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        app.get('/', function (req, res) {
            //res.setHeader('Content-Type', 'text');
            //res.send('Nothing here');
            res.sendFile('index.html');

        });

        app.listen(port, function () {
            console.log('Running server at port %s', port);
        });

        return {
            'app':app,
            'http':http
        };
    }
};