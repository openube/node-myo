'use strict';
const log               = require('custom-logger').config({ level: 0 });
const bodyParser        = require('body-parser');
const path              = require('path');
const sassMiddleware    = require('node-sass-middleware');
const express           = require('express');
const http              = require('http');
const app               = express();
const server              = http.Server(app);
let viewsPath;

module.exports = function(settings){
    viewsPath   = path.join(settings.config.appPath, '/views');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(
        sassMiddleware({
            src: path.join(settings.config.appPath, '/src/scss/'),
            dest: path.join(settings.config.appPath, '/public/css/'),
            debug: true,
            force: true,
            outputStyle: 'expanded',
            prefix: '/static/css'
        })
    );
    app.use('/static', express.static(settings.config.appPath + '/public'));
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

    app.listen();

    server.listen(settings.config.port,function(){
        log.info('Server: Server is listening');
    });

    settings.module.express.app = app;
    settings.module.express.server = server;

    return {
        'app':app,
        'server':server
    };

};