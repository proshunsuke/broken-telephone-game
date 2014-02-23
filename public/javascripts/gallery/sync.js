{
    let mSocket;

    var sync = {

        init: function(){
            // 接続
            mSocket =  io.connect('http://'+location.host+'/gallery',
                                       {'sync disconnect on unload' : true});
            this.syncOnInit(mSocket);
        },

        // socket.onしたら
        syncOnInit: function(socket){
            socket.on('connect', function(data){
                sync.emitInitIndex();
            });

            socket.on('galleryInfo', function(data){
                gallery.toImg(data.imageData);
            });
        },

        emitInitIndex: function(){
            mSocket.emit('initIndex');
        }
    };
}
