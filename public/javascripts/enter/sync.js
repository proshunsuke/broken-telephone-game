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
            socket.on('connect', function(data){
                sync.emitInitIndex();
            });

            socket.on('roomInfo',function(data){
                room.setMroomLength(data.roomLength);
                room.setMroomName(data.roomName);
                room.setMusers(data.users);
            });

            socket.on('createRoom',function(data){
                room.setMroomLength(data.roomLength);
                room.setMroomName(data.roomName);
                room.setMusers(data.users);
            });
        },

        emitInitIndex: function(){
            mSocket.emit('initIndex');
        }
    };
}
