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
                room.createRooms(data.roomdata);
                room.setMroomData(data.roomdata);
            });

            socket.on('createRoom',function(data){
                room.createRooms(data.roomdata);
                room.setMroomData(data.roomdata);
            });

            socket.on('roomCount',function(data){
                room.renewalCount(data.count,data.room,data.hostName);
            });
        },

        emitInitIndex: function(){
            mSocket.emit('initIndex');
        }
    };
}
