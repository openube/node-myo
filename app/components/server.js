var bodyParser      = require('body-parser'),
    path            = require('path'),
    sassMiddleware  = require('node-sass-middleware'),
    express         = require('express'),
    http            = require('http'),
    app             = express(),
    server          = http.Server(app),
    viewsPath;

module.exports = {
    setServer : function(port,url){

        viewsPath   = path.join(url, '/views');

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        app.use('/static', express.static(url + '/public'));
        app.use(
            sassMiddleware({
                src: path.join(url, '/src/scss'),
                dest: path.join(url, '/public/css/'),
                debug: true,
                outputStyle: 'expanded'
            })
        );

        app.set('view engine', 'jade');
        app.set('view options', { layout: true });
        app.set('views', viewsPath);

        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        app.get('/', function (req, res) {
            res.render('index',
                { title : 'Node-myo UI' }
            )
        });

        //app.listen(port, function () {
        //    console.log('Running server at port %s', port);
        //});

        server.listen(port);

        return {
            'app':app,
            'server':server
        };
    }
};