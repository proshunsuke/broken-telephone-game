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
            layer.getUndoImg();
            mDrawFlag = true;

            mStartX = e.pageX - x - mOffset;
            mStartY = e.pageY - y - mOffset;
            return false; // for chrome
        },

        mouseMove: function(e,x,y){
            let endX = e.pageX - x - mOffset;
            let endY = e.pageY - y - mOffset;

            this.drawCore(layer.getLayerNum(),endX,endY,this.getColor(),
                          mBrushSize,mAlphaSize,tool.mTools);

            mStartX = endX;
            mStartY = endY;
        },

        mouseUp: function(){
            layer.getRestoreImg();
            mDrawFlag = false;
        },

        mouseLeave: function(){
            layer.getRestoreImg();
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
                // context.globalAlpha = alpha; //test
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

        //color
        getColor: function(){
            return $("#newcolor").css("background-color");
        },
    };
}
