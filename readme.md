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

##GUI

A node express server is run, served with Jade templates. Open the following URL in your web browser

```
http://localhost:1337
```

The web page serves three purposes:

- Provide a Myo gestures representation, using a drone image.
- Provide the IMU data output by Myo (Gyrocope, Accelerometer and Orientation). Outputs the reading every 250ms.
- Output selected commands/operations being called behind the scene e.g. SocketIO is connected, etc.


__Note:__ This is still a work in progress. A lot of keypresses are not ported over to the GUI. For the time being, it only displays the following detected gestures from Myo: tilt left, tilt right, takeoff and land


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
|h | Hover |
|b | Flips 360 back |
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
