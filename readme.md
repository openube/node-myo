#node-myo

This is a prototype app that controls the Parrot Rolling Spider with MyoJS and PebbleJS

##Acknowledgments
Without the open source projects and guidance from [Chris Willians](https://github.com/voodootikigod/node-rolling-spider) and [Sandeep Mistry](https://github.com/sandeepmistry/noble), this project would not have lifted from the ground (literally).


##Quick run down
This Nodejs app:

- Creates a server and listens for AJAX calls from Pebble.
- Detects keypresses in terminal and controls the drone.
- Connects to Myo and allow dron control.
- Uses socket.io by the client UI to interact with the drone.

##Instructions

###Prerequisites

- Pebble
- Myo
- Bluetooth 4.0 enabled device
- Rolling Spider drone

###Running the PebbleJS app

Build ```pebbleapp/pebblejs.js```as an app in [cloudpebble.net](http://cloudpebble.net) and push to your mobile


###Running the Node app

```
cd app && npm install
```

```
node app.js
```

 Note: Make sure bluetooth is turned on.

### Drone discovery

To discover the ID and name of a certain drone, use ```app/lib/discovery.js```

##Controls


###Keys

|Keys | Function|
|:--------------|:--------|
|Escape button | Exit app |
|q | Exit app |
|Ctrl + C | Exit app |
|Space | Drone take off |
|a | Calibrate Myo starting point |
|x | Toggle lock. This toggles the drone to listen to Myo movements|
|z | Drone land |
|m | Emergency landing|
|up arrow| Forward |
|down arrow| Backward |
|left arrow| Turn left |
|right arrow| Turn right |

###Myo Gestures

|Gestures | Function|
|:--------------|:--------|
| Fist |  Lock|
| Fingers spread | Unlock |
| Hand up|  Drone flies up|
| Hand down|  Drone flies down|
| Hand tilt left|  Drone tilts left|
| Hand tilt right|  Drone tilts right|

###Pebble

|Menu | Function|
|:--------------|:--------|
|Ping | Test if it is able to reach the app service |
|Take off| Drone takes off|
|Land| Drone lands|
|Emergency|Emergency landing|
|Front flip|Flips 360 front|
|Back flip|Flips 360 back|
|Left flip|Flips 360 left|
|Right flip|Flips 360 right|
