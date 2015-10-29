#node-myo

This is a prototype app that controls the Parrot Rolling Spider with MyoJS and PebbleJS

##Instructions

###Prerequisites

- Pebble
- Myo
- Bluetooth 4.0 enabled device
- Rolling Spider drone

###Running the PebbleJS app

Build ```pebblejs.js``` as an app in [cloudpebble.net](http://cloudpebble.net) and push to your mobile


###Running the Node app

```
npm install
```

```
node app.js
```

 Note: Make sure bluetooth is turned on.

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
|up, down, left, right | Unassigned |

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
