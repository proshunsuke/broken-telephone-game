window.onload = function(){
    socket = io.connect('http://'+location.host+'/top', {'sync disconnect on unload' : true});

    socket.emit('init',{
        room: getQuerystring('room'),
        name: $('#name').attr('value')
    });


    $('#commentarea').live('keypress',function (e) {
        if(e.keyCode == 13) {
            box = $(this);
            var t_val = $(box).val();

            if(t_val.length > 0) {
                socket.emit('chatmessage',{
                    text: t_val,
                });
                $(box).val("");
            }
            e.preventDefault();
        }
    });

    socket.on('chatmessage',function(data){
        var insertchat = "<p>"+data.text+"</p>";
        $('#chatArea').prepend(insertchat);
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

}