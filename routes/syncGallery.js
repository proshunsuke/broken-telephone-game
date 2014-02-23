/**
 * Created by shunsuke on 14/02/24.
 */
(function(){

    var Image;

    var emitGalleryInfo = function(galleryRoom, client){
        Image.find({}, function(err, imageData){
            galleryRoom.socket(client.id).emit('galleryInfo',{
                imageData: imageData
            });
        });
    }

    syncGallery = {
        init: function(){
            // db
            model = require('../model');

            // dbのコレクション
            Image = model.Image;
        },

        syncOnInit: function(client, galleryRoom){
            client.on('initIndex',function(){
                emitGalleryInfo(galleryRoom, client);
            });
        }
    }

})();
