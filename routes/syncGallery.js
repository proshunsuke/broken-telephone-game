/**
 * Created by shunsuke on 14/02/24.
 */
(function(){

    var Image;
    var kPageImgsNum = 20;

    var setQuery = function(data){
        var queryText = "{";
        if(data.reqSelectYear != "&nbsp;"){
            queryText += "'year': '"+data.reqSelectYear+"',";
        }
        if(data.reqSelectMonth != "&nbsp;"){
            queryText += "'month': '"+data.reqSelectMonth+"',";
        }
        if(data.reqSelectDate != "&nbsp;"){
            queryText += "'date': '"+data.reqSelectDate+"',";
        }
        if(data.reqSelectUser != ""){
            queryText += "'user': '"+data.reqSelectUser+"',";
        }
        if(data.reqSelectTitle != ""){
            queryText += "'title': '"+data.reqSelectTitle+"',";
        }
        queryText += "}";
        console.log(queryText);
        var obj = (new Function("return " + queryText))();
        return obj;
    }

    var emitGalleryInfo = function(galleryRoom, client, data){
        var reqPageNum = data.reqPageNum;

        // どう頑張っても正規表現がうまくいかないので苦渋の決断
        var query = setQuery(data);
        Image.find(query, function(err, imageData){
            galleryRoom.socket(client.id).emit('galleryInfo',{
                imageData: getShowImgs(reqPageNum, imageData),
                imageDataLength: imageData.length
            });
        });
    }

    // 指定されたページに表示する画像配列を返す
    getShowImgs = function(reqPageNum, imageData){
        var beginNum = imageData.length - (reqPageNum * kPageImgsNum);
        var endNum = beginNum + kPageImgsNum;

        if(beginNum < 0){ // 最後のページで, 最大まで画像がないとき
            beginNum = 0;
        }

        var showImgs = imageData.slice(beginNum, endNum); // 指定要素を取り出す
        return showImgs;
    }

    syncGallery = {
        init: function(){
            // db
            model = require('../model');

            // dbのコレクション
            Image = model.Image;
        },

        syncOnInit: function(client, galleryRoom){
            client.on('reqShowImgs',function(data){
                emitGalleryInfo(galleryRoom, client, data);
            });
        }
    }

})();
