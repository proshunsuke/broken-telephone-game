window.onload = function(){
    socket = io.connect('http://'+location.host+'/top', {'sync disconnect on unload' : true});

    function chat(room, name){
        socket.on('connected',function(){
            console.log("connected");
        });
    }

    $('#enter').live('click',function(){
    //     console.log($('#name').val());
    //     console.log($('#room').val());
    //     socket.emit('init',{
    //         room: $('#room').val(),
    //         name: $('#name').val()
    //     });
    //     // location.href = "/top/room/?room=" + $('#room').val();
    //     location.href = "/top/room?room=" + $('#room').val();
    //     return false;
        var room = $('#room').val();
        document.getElementById("toroom").action = "/top/room?room="+room;
        socket.emit('createroom',{
            room: room,
        });
    });

    function postroom(){
        var name = $('#name').val();
        var room = $('#room').val();
        return "/top/room?room="+room;
    }



    socket.on('message',function(data){
        console.log(data.text);
    });
}

