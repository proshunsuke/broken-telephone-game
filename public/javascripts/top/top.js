var rooms = new Array();

window.onload = function(){
    socket = io.connect('http://'+location.host+'/top', {'sync disconnect on unload' : true});

    socket.on('connected',function(data){
        createrooms(data.rooms);
    });

    socket.on('message',function(data){
        console.log(data.text);
    });

    socket.on('createroom',function(data){
        // socket.emit('init',{
        //     room: data.room,
        //     name: $('#name').val()
        // });
        console.log(data.rooms);
        createrooms(data.rooms);

    });

    var createrooms = function(rooms){
        $('#rooms').empty();
        for(var i=0; i<rooms.length; i++){
            var insertroom="<li class='span3' id='roomli'><a href='/top/login?room="+rooms[i]+"' class='thumbnail'>"+rooms[i]+"</a></li>";
            $('#rooms').prepend(insertroom);
        }
    }

}