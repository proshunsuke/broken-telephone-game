window.onload = function(){
    socket = io.connect('http://'+location.host+'/top', {'sync disconnect on unload' : true});

    function chat(room, name){
        socket.on('connected',function(){
            console.log("connected");
        });
    }

    $('#enter').live('click',function(){
        var room = getQuerystring('room');
        document.getElementById("toroom").action = "/top/room?room="+room;
    });



    function getQuerystring(key, default_){
        if (default_==null) default_="";
        key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
        var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
        var qs = regex.exec(window.location.href);
        if(qs == null)
            return default_;
        else
            return qs[1];
    }



    socket.on('message',function(data){
        console.log(data.text);
    });
}
