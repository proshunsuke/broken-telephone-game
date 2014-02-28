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
                sync.emitReqShowImgs();
            });

            socket.on('galleryInfo', function(data){
                gallery.toImg(data.imageData);
                gallery.setPagination(gallery.getMreqPageNum(),data.imageDataLength);
            });
        },

        emitReqShowImgs: function(){
            mSocket.emit('reqShowImgs', {
                reqSelectYear: gallery.getMselectYear(),
                reqSelectMonth: gallery.getMselectMonth(),
                reqSelectDate: gallery.getMselectDate(),
                reqSelectUser: gallery.getMselectUser(),
                reqSelectTitle: gallery.getMselectTitle(),
                reqPageNum: gallery.getMreqPageNum()
            });
        }
    };
}
