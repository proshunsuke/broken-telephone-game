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
                sync.emitReqShowImgs();
            });

            socket.on('roomInfo',function(data){
                room.setMroomLength(data.roomLength);
                room.setMroomName(data.roomName);
            });

            socket.on('createRoom',function(data){
                room.setMroomLength(data.roomLength);
                room.setMroomName(data.roomName);
            });
        },

        // emit
        emitCreateRoom: function(room,name,password){
            mSocket.emit('createRoom',{
                room: room,
                name: name,
                password: password
            });
//            alert(room+"部屋が作成されました");

        },

        emitReqShowImgs: function(){
            mSocket.emit('initIndex');
        }

    };
}
