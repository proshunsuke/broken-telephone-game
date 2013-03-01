function Sync(){
    this._socket;

    this.init = function(){
        // 接続
        this._socket =  io.connect('http://'+location.host+'/room',
                                  {'sync disconnect on unload' : true});
        sync_on_init(this._socket);

    }

    // socket.onしたら
    function sync_on_init(socket){
        socket.on('connected',function(data){
            r_room.createrooms(data.rooms,data.creaters,data.counts);
            // for(var i=0; i < data.rooms.length; i++){
            //     r_room.renewal_count(data.counts[i],data.rooms[i]);
            // }
        });

        socket.on('createroom',function(data){
            r_room.createrooms(data.rooms,data.creaters,data.counts);
        });

        socket.on('room_count',function(data){
            r_room.renewal_count(data.count,data.room);
        });
    }


    // emit
    this.emit_createroom = function(room,name){
        this._socket.emit('createroom',{
            room: room,
            name: name,
        });
        //alert(room+"部屋が作成されました");
        sleep(1);
    }


}