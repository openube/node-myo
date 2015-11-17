var arr = [],
    hasTakeOff = false,
    timer;

$(function() {
    var socket = io.connect('http://localhost:1337');


    socket.on('connect', function(data) {
        console.log('connected');
        socket.emit('success', 'Success');
    });

    socket.on('imu', function(data) {
        updateInfoDetails(data);
    });

    socket.on('console', function(data) {
        updateConsoleDetails(data);
    });

    socket.on('drone', function(data) {
        updateDrone(data);
    });
    socket.on('droneStatus', function(bFlag) {
        hasTakeOff = bFlag;
    });
});

function updateDrone(raw){
    var data = raw.data;
    if (hasTakeOff){
        $('#drone')
            .addClass('takeoff')
            .addClass(data);

        window.clearTimeout(timer);

        timer = window.setTimeout(function(){
            $('#drone').removeClass(data);
        },1000);
    } else{
        $('#drone').attr('class', 'visual__drone land');
    }





}

function updateConsoleDetails(raw){
    if (arr.length > 5){
        arr.shift();
    }else{
        arr.push(raw.data);
    }

    $('#console').empty();
    for (var i=arr.length - 1; i >=  0; i--){
        $('#console').append(
            $('<span>')
                .addClass('console__item')
                .html(arr[i])
        );
    }
}

function updateInfoDetails(raw){
    var data = raw.data;
    $.each(data, function(k,v){
        var $list = $('#'+k);
        $.each(v,function(i,j){
            $list
                .find('li[data-type="'+ i +'"]')
                .empty()
                .append(
                    $('<div>').addClass('label').html(i)
                )
                .append(
                    $('<div>').addClass('label').html(round(j,3))
                );
        });
    });
}

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}