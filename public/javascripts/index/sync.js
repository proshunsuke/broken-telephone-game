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
                room.createRooms(data.roomdata);
                room.setMroomData(data.roomdata);
            });

            socket.on('createRoom',function(data){
                room.createRooms(data.roomdata);
                room.setMroomData(data.roomdata);
                console.log("roomdata:",data.roomdata);
            });

            socket.on('roomCount',function(data){
                room.renewalCount(data.count,data.room,data.hostname);
            });
        }
    };
}
