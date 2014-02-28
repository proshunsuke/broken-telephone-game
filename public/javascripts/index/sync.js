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
                room.createRooms(data.roomLength, data.users, data.roomName, data.hostName, data.isPassword);
            });

            socket.on('createRoom',function(data){
                room.setMroomLength(data.roomLength);
                room.setMroomName(data.roomName);
                room.createRooms(data.roomLength, data.users, data.roomName, data.hostName, data.isPassword);
            });

            socket.on('roomCount',function(data){
                room.renewalCount(data.count,data.room,data.hostName);
            });

            socket.on('canEnterRoom', function(data){
                if(data.canEnter){
                    location.href = "/enter?room=" + room.getMenterRoomName();
                }else{
                    alert("パスワードが間違っています");
                }
            });
        },

        emitReqShowImgs: function(){
            mSocket.emit('initIndex');
        },

        emitPasswordInfo: function(){
            mSocket.emit('passwordInfo', {
                roomName: room.getMenterRoomName(),
                password: room.getMpassword()
            });
        }
    };
}
