{

    let mOffset;
    let mStartX;
    let mStartY;

    let mDrawFlag;
    let mIsDrawable;

    let mBrushSize;
    let mAlphaSize;

    // aは１００分のいくつか
    let changeSlideAlpha = function(a){
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
    };

    var paint = {

        // getter

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
        },

        mouseClick: function(e,x,y){
            mStartX = e.pageX - x - mOffset;
            mStartY = e.pageY - y - mOffset;
            let spuit_color = layer.getSpuitColor(mStartX,mStartY);
            $("#newcolor").css("background-color",spuit_color.toRGBA());
            let slide_alpha = 100 * spuit_color.a / 255;
            changeSlideAlpha(slide_alpha);
        },


        mouseDown: function(e,x,y){

            mDrawFlag = true;
            mStartX = e.pageX - x - mOffset;
            mStartY = e.pageY - y - mOffset;

            layer.setMcanvasTarget(layer.getLayerNum());
            return false; // for chrome
        },

        mouseMove: function(e,x,y){
            let endX = e.pageX - x - mOffset;
            let endY = e.pageY - y - mOffset;

            this.drawCore(layer.getMcanvasDrawing(),endX,endY);

            mStartX = endX;
            mStartY = endY;
        },

        mouseUp: function(){
            layer.getRestoreImg();
            layer.getUndoImg();

            layer.getMcanvasDrawing().getContext("2d").globalCompositeOperation="source-over";
            layer.getMcanvasDrawing().getContext("2d").globalAlpha = 1.0;

            layer.getMcanvasTarget().getContext("2d").globalAlpha = mAlphaSize;
            layer.getMcanvasTarget().getContext("2d").drawImage(layer.getMcanvasDrawing(),0,0);
            layer.getMcanvasTarget().getContext("2d").globalAlpha = 1.0;

            layer.getMcanvasDrawing().getContext("2d").clearRect(0, 0, $('canvas').width(), $('canvas').height());

            mDrawFlag = false;
        },

        mouseLeave: function(){
            layer.getRestoreImg();
            mDrawFlag = false;
        },

        drawCore: function(canvas,x,y){
            let context;
            if(canvas.getContext){
                context = canvas.getContext("2d");
            }
            context.beginPath();

            if(tool.getMtools()["eraser"]){
                context.strokeStyle = "#FFFFFF";
            }else{
                context.strokeStyle = this.getColor();
                layer.setLayerOpacity(mAlphaSize);
            }
            context.globalCompositeOperation = 'source-over';
            context.lineWidth = mBrushSize;
            context.lineJoin= 'round';
            context.lineCap = 'round';
            context.shadowBlur = 0;

            context.setTransform(1, 0, 0, 1, 0, 0);
            context.moveTo(mStartX, mStartY);
            context.lineTo(x, y);
            context.stroke();
            context.closePath();
        },

        //color
        getColor: function(){
            return $("#newcolor").css("background-color");
        },
    };
}
