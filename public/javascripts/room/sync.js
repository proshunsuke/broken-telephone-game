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
            r_room.createrooms(data.roomdata);
            r_room._room_data = data.roomdata;
        });

        socket.on('createroom',function(data){
            r_room.createrooms(data.roomdata);
            r_room._room_data = data.roomdata;
            console.log("roomdata:",data.roomdata);
        });

        socket.on('room_count',function(data){
            r_room.renewal_count(data.count,data.room,data.hostname);
        });

    }


    // emit
    this.emit_createroom = function(room,name,password){
        this._socket.emit('createroom',{
            room: room,
            name: name,
            password: password,
        });
        alert(room+"部屋が作成されました");
    }

    this.emit_get_room_data = function(){
        this._socket.emit('get_room_data',{
        });
    }


}