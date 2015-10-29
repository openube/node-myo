var UI = require('ui'),
    ajax = require('ajax'),
    Vibe = require('ui/vibe');

var ajaxUrl = "https://path.to.server.com/pebblecall",
    droneActions = [
        {
            title: "Ping",
            subtitle: "Check for connection",
            command: "ping"
        },
        {
            title: "Takeoff",
            subtitle: "",
            command:"takeoff"
        },
        {
            title: "Land",
            subtitle: "",
            command:"land"
        },
        {
            title: "Emergency",
            subtitle: "Emergency landing",
            command:"emergency"
        },
        {
            title: "Front Flip",
            subtitle: "Flips front 180deg",
            command:"flipfront"
        },
        {
            title: "Back Flip",
            subtitle: "Flips back 180deg",
            command:"flipback"
        },
        {
            title: "Left Flip",
            subtitle: "Flips left 180deg",
            command:"flipleft"
        },
        {
            title: "Right Flip",
            subtitle: "Flips right 180deg",
            command:"flipright"
        }
    ];

var pebbleDroneMenu = new UI.Menu({
    sections: [{
        title: 'PebbleDrone',
        items: droneActions
    }]
});

pebbleDroneMenu.show();

pebbleDroneMenu.on('select', function(event) {
    var command  = droneActions[event.itemIndex].command;
    callAjax(command);
});

function callAjax(str){
    var ajaxResponse = new UI.Card({
        title: "Ajax Response",
        body:"",
        scrollable :true
    });
    console.log(str);
    ajax({
            url: ajaxUrl,
            type: 'json',
            method: 'post',
            data:  {'type':str},
            crossDomain:true
        },
        function(str) {
            console.log('returns=' + str.type + ', ' + str.text);

            switch(str.type){
                case 'ping':
                    ajaxResponse.title("Ping received");
                    ajaxResponse.body(str.text);
                    ajaxResponse.show();
                    Vibe.vibrate('short');
                    break;
                case 'takeoff':
                    Vibe.vibrate('short');
                    break;
            }

        },
        function(error) {
            console.log('Ajax failed: ' + error);
            ajaxResponse.title("Ajax failed");
            ajaxResponse.body(error);
            ajaxResponse.show();
        }
    );
}