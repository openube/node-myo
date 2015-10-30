var pebble          = require('./components/pebble'),
    localtunnel     = require('./components/localtunnel'),
    myo             = require('./components/myo'),
    drone           = require('./components/drone'),
    keypress        = require('./components/keypress'),
    port            = 1337,
    myDrone,
    myMyo,
    myTunnel;

myTunnel = localtunnel(port, 'somesubdomainabc123');
myDrone = drone.connect();
myMyo = myo.connect(myDrone);
pebble.setServer(port,myDrone);
keypress.setListeners(myDrone,myMyo,myTunnel);

