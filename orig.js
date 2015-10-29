var keypress        = require('keypress'),
    app             = require('express')(),
    bodyParser      = require('body-parser'),
    http            = require('http').Server(app),
    localtunnel     = require('./components/localtunnel'),
    Myo             = require('myo'),
    RollingSpider   = require('rolling-spider'),

    port            = 1337,
    rollingSpider   = new RollingSpider(),
    isReady         = false,
    hasTakeoff      = false,
    isLocked        = true,
    accelerometer   = {},
    movementOffset  = {
        x:-0.2,
        y:-0.3
    },
    delay           = 1000,
    timeOffset      = new Date().getTime();


//Run proxy  tunnel
//localtunnel.init(port, 'whitemanjuu');


keypress(process.stdin);
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.setRawMode(true);


//RS_R064511
rollingSpider.connect(function() {
    console.log('rollingSpider connect');
    rollingSpider.setup(function() {
        rollingSpider.flatTrim();
        rollingSpider.startPing();
        rollingSpider.flatTrim();
        isReady = true;
        console.log('rollingSpider ready');
    });
});


process.stdin.on('keypress', function (ch, key) {

    if ( !key ) return;
    //console.log('pressed', key.name);

    switch (key.name){
        case 'q':
        case 'escape':
            console.log('Exit');
            setRollingSpider('emergency');
            process.stdin.pause();
            process.exit();
            break;

        case 'up':
            break;
        case 'down':
            break;
        case 'left':
            break;
        case 'right':
            break;

        case 'space':
            setRollingSpider('takeoff');
            console.log('Take off');
            break;

        case 'a':
            movementOffset = getAccelerometer();
            console.log('Calibrated = ', movementOffset);
            break;

        case 'x':
            isLocked = !isLocked;
            console.log('isLocked = ', isLocked);
            break;

        case 'z' :
            setRollingSpider('land');
            console.log('Land');
            break;

        case 'm':
            setRollingSpider('emergency');
            console.log('Emergency');
            break;

    }

    if (key && key.ctrl && key.name == 'c') {
        console.log('Exit');
        setRollingSpider('emergency');
        process.stdin.pause();
        process.exit();
    }
});

//Pebble and server
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

    console.log('Pebblecall =',a.type);
    switch (a.type) {
        case 'ping':
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
            setRollingSpider(a.type);
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
    //var host = server.address().address;
    //var port = server.address().port;
    console.log('Running server at port %s', port);
});


function setRollingSpider(type){
    if (!isReady) {
        console.log('rollingSpider is not ready!');
        return;
    }

    if (type == 'takeoff') {

        if (hasTakeoff) {
            hasTakeoff = false;
            rollingSpider.flatTrim();
            rollingSpider.land();
        } else {
            hasTakeoff = true;
            rollingSpider.flatTrim();
            rollingSpider.takeOff();
        }
    } else {

        switch (type) {
            case 'up':
                rollingSpider.up({ steps: 2});
                break;
            case 'down':
                rollingSpider.down({ steps: 2});
                break;
            case 'tiltLeft':
                rollingSpider.tiltLeft({ steps: 2});
                break;
            case 'tiltRight':
                rollingSpider.tiltRight({ steps: 2});
                break;
            case 'land':
                rollingSpider.land();
                rollingSpider.flatTrim();
                hasTakeoff = false;
                break;
            case 'flipfront':
                rollingSpider.frontFlip();
                break;
            case 'flipback':
                rollingSpider.backFlip();
                break;
            case 'flipleft':
                rollingSpider.leftFlip();
                break;
            case 'flipright':
                rollingSpider.rightFlip();
                break;
            case 'emergency':
                rollingSpider.emergency();
                hasTakeoff = true;
                break;
            default:
                break;

        }
    }
}

Myo.connect();

Myo.on('connected',function(){
    console.log('Myo connected. ID:', this.name);
    console.log('----------------------------');
    this.streamEMG(true);

});

Myo.on('arm_synced',function(myo, data){
    console.log('Synced');
});

Myo.on('arm_unsynced',function(){
    console.log('Unsynced');

});

Myo.on('unlocked',function(){
    console.log('Unlocked');
    this.unlock();
});

Myo.on('double_tap', function(){
    console.log('Double tap');

});

Myo.on('fist', function(myo, data){
    isLocked = true;
    console.log('isLocked = ',isLocked);
});

Myo.on('fingers_spread', function(myo, data){
    isLocked = false;
    console.log('isLocked = ',isLocked);
});



Myo.on('accelerometer', function(data){
    accelerometer = data;
    if (!isLocked) {
        if ((new Date().getTime() - timeOffset) > delay) {
            timeOffset = new Date().getTime();

            if ((movementOffset.y - data.y) > 0.4){
                console.log('tiltLeft');
                setRollingSpider('tiltLeft');
            } else if ((movementOffset.y - data.y) < -0.4){
                console.log('tiltRight');
                setRollingSpider('tiltRight');
            }

            if ((movementOffset.x - data.x) > 0.35){
                console.log('move down');
                setRollingSpider('down');
            } else if ((movementOffset.x - data.x) < -0.35){
                console.log('move up');
                setRollingSpider('up');
            }

        }
    }

});

function getAccelerometer(){
    return accelerometer;
}


