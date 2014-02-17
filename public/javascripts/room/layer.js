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

    let kUndoNum;
    let mCanUndoNum;
    let mCanRestoreNum;

    // mCanUndoNum以降のmUndoImg配列を消す
    // mUndoImg[0]〜[40]まである時, mCanUndoNumが20だと
    // mUndoImg[21]〜[40]を削除
    let deleteUndoImgAfterCanUndoNum = function(){
        // 消す必要があるときだけ消す
        if(mUndoImg.length != mCanUndoNum+1){
            mUndoImg.splice(mCanUndoNum+1,mUndoImg.length-mCanUndoNum);
        }
    }

    let showOrHideUndoRestoreBtn = function(){
        //undo
        if(mCanUndoNum == 0 || $('#clear').hasClass("disabled")){
            $('#undo').addClass('disabled');
        }else{
            $('#undo').removeClass('disabled');
        }

        // restore
        if(mCanRestoreNum >= mUndoImg.length || mUndoImg.length <= 1){
            $('#restore').addClass('disabled');
        }else{
            $('#restore').removeClass('disabled');
        }
    }

    let showOrHideClearBtn = function(){
        // clear
        if(mUndoImg.length <= 0){
            $('#clear').addClass("disabled");
        }else{
            $('#clear').removeClass("disabled");
        }
    }

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

        getMcanUndoNum: function(){
            return mCanUndoNum;
        },

        getMcanRestoreNum: function(){
            return mCanRestoreNum;
        },

        // setter

        setMcanvasTarget: function(canvasTarget){
            mCanvasTarget = canvasTarget;
        },

        setMcanvasDrawing: function(canvasDrawing){
            mCanvasDrawing = canvasDrawing;
        },

        setMcanUndoNum: function(canUndoNum){
            mCanUndoNum = canUndoNum;
        },

        init: function(){
            mCanvasDrawing = $('canvas').get(0);
            mCanvas1 = $('canvas').get(1);
            mCanvas2 = $('canvas').get(3);
            mCanvas3 = $('canvas').get(5);
            mCanvasTarget = mCanvas1;
            mCanvasSave = $('canvas').get(6);
            mUndoImg = [];
            mRestoreImg = [];
            mUndoContext = [];
            kUndoNum = 33;
            mCanUndoNum = -1;
            this.getUndoImg();
        },

        setLayerOpacity: function(alphaSize){
            mCanvasDrawing.style.opacity = alphaSize;
        },

        //レイヤー、描くキャンバスを返す
        getLayerNum: function(){
            let targetCanvas;
            $('#layerul li:nth-child(n)').each(function(){
                if ($(this).hasClass('active')){
                    switch($(this).attr("id")){
                    case "1":
                        targetCanvas = mCanvas1;
                        break;
                    case "2":
                        targetCanvas = mCanvas2;
                        break;
                    case "3":
                        targetCanvas = mCanvas3;
                        break;
                    }
                }
            });
            return targetCanvas;
        },

        // 描くキャンバスを設定
        setMcanvasDrawingFromTargetCanvas: function(targetCanvas){

            // 消しゴム選択している時は,targetCanvasに直接描く
            if(tool.getMtools()["eraser"]){
                mCanvasDrawing = targetCanvas;
                return;
            }

            switch(targetCanvas){
                case mCanvas1:
                    mCanvasDrawing = mCanvasDrawing = $("canvas").get(0);
                    break;
                case mCanvas2:
                    mCanvasDrawing = mCanvasDrawing = $("canvas").get(2);
                    break;
                case mCanvas3:
                    mCanvasDrawing = mCanvasDrawing = $("canvas").get(4);
                    break;
            }
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
        // キャンバスにmouseDownする毎に呼び出される
        getUndoImg: function(){
            let canvas_array = [mCanvas1,mCanvas2,mCanvas3];
            let mTempUndoImg = [];
            for(var i=0; i < LAYER_N; i++){
                mUndoContext[i] = canvas_array[i].getContext('2d');
                mTempUndoImg[i] =
                    mUndoContext[i].getImageData(0, 0, $('canvas').width(), $('canvas').height());
            }

            if(mUndoImg.length > kUndoNum){
                mUndoImg.splice(1,1);
            }else{
                this.canUndoNumPlus();
            }

            mUndoImg.push(mTempUndoImg);
            deleteUndoImgAfterCanUndoNum();
        },

        // mCanUndoNumをプラス１する, mCanRestoreNumは常にmCanUndoNum+1の値になるので連動させる
        canUndoNumPlus: function(){
            mCanUndoNum++;
            mCanRestoreNum = mCanUndoNum+1 ;
            showOrHideClearBtn();
            showOrHideUndoRestoreBtn();
        },

        canUndoNumMinus: function(){
            mCanUndoNum--;
            mCanRestoreNum = mCanUndoNum+1 ;
            showOrHideUndoRestoreBtn();
        },

        // redo
        getRestoreImg: function(){
            for(var i=0; i < LAYER_N; i++){
                mRestoreImg[i] =
                    mUndoContext[i].getImageData(0, 0, $('canvas').width(), $('canvas').height());
            }
        },

        putImageDataToUndoContext: function(img,canNum,layerNum){
            mUndoContext[layerNum].putImageData(img[canNum][layerNum],0,0);
        },

        putImageDataToRestoreContext: function(img,layerNum){
            mUndoContext[layerNum].putImageData(img[layerNum],0,0);
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