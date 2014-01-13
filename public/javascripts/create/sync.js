{
    let mSocket;

    var sync = {

        init: function(){
            // 接続
            mSocket =  io.connect('http://'+location.host+'/room',
                                       {'sync disconnect on unload' : true});
            this.syncOnInit(mSocket);
        },

        // socket.onしたら
        syncOnInit: function(socket){
            socket.on('connected',function(data){
                room.setMroomData(data.roomdata);
            });

            socket.on('createRoom',function(data){
                room.setMroomData(data.roomdata);
            });
        },

        // emit
        emitCreateRoom: function(room,name,password){
            mSocket.emit('createRoom',{
                room: room,
                name: name,
                password: password,
            });
            alert(room+"部屋が作成されました");
        }
    };
}
