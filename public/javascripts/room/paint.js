{

    let mOffset;
    let mStartX;
    let mStartY;
    let mCanvas1;
    let mCanvas2;
    let mCanvas3;
    let mDrawFlag;
    let mIsDrawable;
    let mBrushSize;
    let mAlphaSize;
    let mCanvasSave;
    let mUndoImage;
    let mRestoreImage;
    let mUndoContext;

    var paint = {

        // getter

        getMcanvas1: function(){
            return mCanvas1;
        },

        getMdrawFlag: function(){
            return mDrawFlag;
        },

        getMisDrawable: function(){
            return mIsDrawable
        },

        getMbrushSize: function(){
            return mBrushSize;
        },

        getMalphaSize: function(){
            return mAlphaSize;
        },

        // setter

        setMdrawFlag: function(drawFlag){
            mDrawFlag = drawFlag;
        },

        setMisDrawable: function(isDrawable){
            mIsDrawable = isDrawable;
        },

        setMisDrawable: function(isDrawable){
            mIsDrawable = isDrawable;
        },

        setMbrushSize: function(brushSize){
            mBrushSize = brushSize;
        },

        setMalphaSize: function(alphaSize){
            mAlphaSize = alphaSize;
        },

        init: function(){
            mOffset = 5;
            mDrawFlag = false;
            mIsDrawable = true;
            mBrushSize = 10;
            mAlphaSize = 1;
            mCanvas1 = $('canvas').get(0);
            mCanvas2 = $('canvas').get(1);
            mCanvas3 = $('canvas').get(2);
            mCanvasSave = $('canvas').get(3);
            mUndoImage = new Array(LAYER_N);
            mRestoreImage = new Array(LAYER_N);
            mUndoContext = new Array(LAYER_N);
            paint.getUndoImg();
        },

        mouseClick: function(e,x,y){
            mStartX = e.pageX - x - mOffset;
            mStartY = e.pageY - y - mOffset;
            let spuit_color = this.getSpuitColor(mStartX,mStartY);
            $("#newcolor").css("background-color",spuit_color.toRGBA());
            let slide_alpha = 100 * spuit_color.a / 255;
            this.changeSlideAlpha(slide_alpha);

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

        // aは１００分のいくつか
        changeSlideAlpha: function(a){
            $('#slider2').slider({
                value : a,
                slide : function(evt, ui){
                    let alpha = ui.value;
                    $('#alpha').val(alpha);
                    if(alpha == 100){
                        mAlphaSize = 1;
                    }else if(alpha <= 9){
                        mAlphaSize = '0.0' + alpha;
                    }else if(alpha >= 10){
                        mAlphaSize = '0.' + alpha;
                    };
                }
            });
            $('#alpha').val($('#slider2').slider('value'));
            mAlphaSize = a / 100;

        },

        mouseDown: function(e,x,y){
            paint.getUndoImg();
            mDrawFlag = true;

            mStartX = e.pageX - x - mOffset;
            mStartY = e.pageY - y - mOffset;
            return false; // for chrome
        },

        mouseMove: function(e,x,y){
            let endX = e.pageX - x - mOffset;
            let endY = e.pageY - y - mOffset;

            paint.drawCore(this.getLayerNum(),endX,endY,this.getColor(),
                           mBrushSize,mAlphaSize,tool.mTools);

            mStartX = endX;
            mStartY = endY;
        },

        mouseUp: function(){
            this.getRestoreImg();
            mDrawFlag = false;
        },

        mouseLeave: function(){
            this.getRestoreImg();
            mDrawFlag = false;
        },

        drawCore: function(canvas,x,y,color,size,alpha,tool){
            let context;
            if (canvas.getContext) {
                context = canvas.getContext('2d');
            }
            context.beginPath();
            context.globalCompositeOperation = 'source-over';
            if(tool.eraser == true){
                context.globalAlpha = 1;
                context.strokeStyle = "#FFFFFF";
            }else{
                context.globalAlpha = alpha;
                context.strokeStyle = color;
            }

            context.lineWidth = size;
            context.lineJoin= 'round';
            context.lineCap = 'round';
            context.shadowBlur = 0;
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.moveTo(mStartX, mStartY);
            context.lineTo(x, y);
            context.stroke();
            context.closePath();
        },

        //レイヤー、描くキャンバスを返す
        getLayerNum: function(){
            let select_canvas;
            $('#layerul li:nth-child(n)').each(function(){
                if ($(this).hasClass('active')){
                    switch($(this).attr("id")){
                    case "1":
                        select_canvas = mCanvas1;
                        break;
                    case "2":
                        select_canvas = mCanvas2;
                        break;
                    case "3":
                        select_canvas = mCanvas3;
                        break;
                    }
                }
            });
            return select_canvas;
        },

        //color
        getColor: function(){
            return $("#newcolor").css("background-color");
        },

        //undo 描いた絵のキャンバスとイメージを取得
        getUndoImg: function(){
            let canvas_array = [mCanvas1,mCanvas2,mCanvas3];
            for(var i=0; i < LAYER_N; i++){
                mUndoContext[i] = canvas_array[i].getContext('2d');
                mUndoImage[i] =
                    mUndoContext[i].getImageData(0, 0, $('canvas').width(), $('canvas').height());
            }
        },

        // redo
        getRestoreImg: function(){
            for(var i=0; i < LAYER_N; i++){
                mRestoreImage[i] =
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