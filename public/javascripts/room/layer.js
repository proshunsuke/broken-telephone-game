{
    let mCanvasDrawing;
    let mCanvas1;
    let mCanvas2;
    let mCanvas3;

    let mCanvasTarget;

    let mCanvasSave;

    let mUndoImg;
    let mRestoreImg;

    let mUndoContext;

    var layer = {

        // getter

        getMcanvasDrawing: function(){
            return mCanvasDrawing;
        },

        getMcanvas1: function(){
            return mCanvas1;
        },

        getMcanvas2: function(){
            return mCanvas2;
        },

        getMcanvas3: function(){
            return mCanvas3;
        },

        getMcanvasTarget: function(){
            return mCanvasTarget;
        },

        getMundoImg: function(){
            return mUndoImg;
        },

        getMrestoreImg: function(){
            return mRestoreImg;
        },

        getMundoContext: function(){
            return mUndoContext;
        },


        // setter

        setMcanvasTarget: function(canvasTarget){
            mCanvasTarget = canvasTarget;
        },

        setMcanvasDrawing: function(canvasDrawing){
            mCanvasDrawing = canvasDrawing;
        },

        init: function(){
            mCanvasDrawing = $('canvas').get(0);
            mCanvas1 = $('canvas').get(1);
            mCanvas2 = $('canvas').get(3);
            mCanvas3 = $('canvas').get(5);
            mCanvasTarget = mCanvas1;
            mCanvasSave = $('canvas').get(6);
            mUndoImg = new Array(LAYER_N);
            mRestoreImg = new Array(LAYER_N);
            mUndoContext = new Array(LAYER_N);
            this.getUndoImg();
        },

        putImageDataToUndoContext: function(img,i){
            mUndoContext[i].putImageData(mUndoImg[i],0,0);
        },

        setLayerOpacity: function(alphaSize){
            mCanvasDrawing.style.opacity = alphaSize;
        },

        //レイヤー、描くキャンバスを返す
        getLayerNum: function(){
            let selectCanvas;
            $('#layerul li:nth-child(n)').each(function(){
                if ($(this).hasClass('active')){
                    switch($(this).attr("id")){
                    case "1":
                        selectCanvas = mCanvas1;
                        mCanvasDrawing = $("canvas").get(0);
                        break;
                    case "2":
                        selectCanvas = mCanvas2;
                        mCanvasDrawing = $("canvas").get(2);
                        break;
                    case "3":
                        selectCanvas = mCanvas3;
                        mCanvasDrawing = $("canvas").get(4);
                        break;
                    }
                }
            });
            return selectCanvas;
        },

        getSpuitColor: function(x,y){
            let canvas_array = [mCanvas1,mCanvas2,mCanvas3];
            let valid_color = null;
            for(var i=LAYER_N-1; i >= 0; i--){
                let context = canvas_array[i].getContext("2d");
                let spuitImage = context.getImageData(x, y, 1, 1);
                let a = spuitImage.data[3];
                if(a != 0){
                    let r = spuitImage.data[0];
                    let g = spuitImage.data[1];
                    let b = spuitImage.data[2];
                    valid_color =  new RGBColor('rgba(' + r +','+ g + ',' + b + ',' + a + ')');
                }
            }
            if(valid_color == null){// 色が塗られていなければ白を返す
                valid_color =  new RGBColor('rgba(' + 255 +','+ 255 + ',' + 255 + ',' + 255 + ')');
            }
            return valid_color;
        },

        //undo 描いた絵のキャンバスとイメージを取得
        getUndoImg: function(){
            let canvas_array = [mCanvas1,mCanvas2,mCanvas3];
            for(var i=0; i < LAYER_N; i++){
                mUndoContext[i] = canvas_array[i].getContext('2d');
                mUndoImg[i] =
                    mUndoContext[i].getImageData(0, 0, $('canvas').width(), $('canvas').height());
            }
        },

        // redo
        getRestoreImg: function(){
            for(var i=0; i < LAYER_N; i++){
                mRestoreImg[i] =
                    mUndoContext[i].getImageData(0, 0, $('canvas').width(), $('canvas').height());
            }
        },

        // 描いている絵を全消去
        clearCanvas: function(){
            for(var i=0; i < LAYER_N; i++){
                mUndoContext[i].clearRect(0, 0, $('canvas').width(), $('canvas').height());
            }
        },

        // キャンバス保存、またはイメージURLを返す
        saveOrSendImg: function(layer_n,which){
            let canvas = mCanvasSave;
            let context = canvas.getContext("2d");
            let canvas_array = [mCanvas1,mCanvas2,mCanvas3];
            innerRec(layer_n);

            function innerRec(layer_n){
                if(layer_n<=0){
                    let d = canvas.toDataURL('image/png');
                    if(which == 1){ // 保存
                        d = d.replace('image/png', 'image/octet-stream');
                        window.open(d, 'save');
                        context.clearRect(0, 0, $('canvas').width(), $('canvas').height());
                    }else if(which == 2){// 次の人に絵を伝える
                        // var draw_start_Date = new Date();　// 次の人の描きはじめの時間は、前の人の描き終わった時間
                        // sync.emit_drawfin(user.user,user.mOrderList,draw_start_Date,d);
                        sync.emitDrawFin(user.getMuser(),user.getMorderList(),d); // test
                        context.clearRect(0, 0, $('canvas').width(), $('canvas').height());
                    }
                }else{
                    let d = canvas_array[layer_n-1].toDataURL().replace('image/png', 'image/octet-stream');
                    let img = new Image();
                    img.src = d;
                    img.onload = function(){
                        layer_n -=1;
                        context.drawImage(img,0,0);
                        innerRec(layer_n);
                    }
                }
            }
        }
    };
}