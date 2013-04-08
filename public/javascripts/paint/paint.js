function Paint(){
    this._offset;
    this._startX;
    this._startY;
    this._draw_flag;
    this._isDrawable;
    this._brushSize;
    this._alphaSize;
    this._canvas1;
    this._canvas2;
    this._canvas3;
    this._canvasSave;
    this._undoImage;
    this._restoreImage;
    this._undo_context;


    this.init = function(){
        this._offset = 5;
        this._draw_flag = false;
        this._isDrawable = true;
        this._brushSize = 10;
        this._alphaSize = 1;
        this._canvas1 = $('canvas').get(0);
        this._canvas2 = $('canvas').get(1);
        this._canvas3 = $('canvas').get(2);
        this._canvasSave = $('canvas').get(3);
        this._undoImage = new Array(LAYER_N);
        this._restoreImage = new Array(LAYER_N);
        this._undo_context = new Array(LAYER_N);
        this._get_undo_img();
    }

    this._mouse_click = function(e,x,y){
        this._startX = e.pageX - x - this._offset;
        this._startY = e.pageY - y - this._offset;
        var spuit_color = this._get_spuit_color(this._startX,this._startY);
        $("#newcolor").css("background-color",spuit_color.toRGBA());
        var slide_alpha = 100 * spuit_color.a / 255;
        this._change_slide_alpha(slide_alpha);

    }

    this._get_spuit_color = function(x,y){
        var canvas_array = [b_paint._canvas1,b_paint._canvas2,b_paint._canvas3];
        var valid_color = null;
        for(var i=LAYER_N-1; i >= 0; i--){
            var context = canvas_array[i].getContext("2d");
            var spuitImage = context.getImageData(x, y, 1, 1);
            var a = spuitImage.data[3];
            if(a != 0){
                var r = spuitImage.data[0];
                var g = spuitImage.data[1];
                var b = spuitImage.data[2];
                valid_color =  new RGBColor('rgba(' + r +','+ g + ',' + b + ',' + a + ')');
            }
        }
        if(valid_color == null){// 色が塗られていなければ白を返す
            valid_color =  new RGBColor('rgba(' + 255 +','+ 255 + ',' + 255 + ',' + 255 + ')');
        }
        return valid_color;

    }

    // aは１００分のいくつか
    this._change_slide_alpha = function(a){
        $('#slider2').slider({
            value : a,
            slide : function(evt, ui){
                alpha = ui.value;
                $('#alpha').val(alpha);
                if(alpha == 100){
                    b_paint._alphaSize = 1;
                }else if(alpha <= 9){
                    b_paint._alphaSize = '0.0' + alpha;
                }else if(alpha >= 10){
                    b_paint._alphaSize = '0.' + alpha;
                };
            }
        });
        $('#alpha').val($('#slider2').slider('value'));
        this._alphaSize = a / 100;

    }

    this._mouse_down = function(e,x,y){

        this._get_undo_img();

        this._draw_flag = true;
        this._startX = e.pageX - x - this._offset;
        this._startY = e.pageY - y - this._offset;
        return false; // for chrome
    }

    this._mouse_move = function(e,x,y){
        var endX = e.pageX - x - this._offset;
        var endY = e.pageY - y - this._offset;

        this._draw_core(this._get_layer_num(),endX,endY,b_paint._get_color(),
                        b_paint._brushSize,b_paint._alphaSize,b_tool._tools);

        this._startX = endX;
        this._startY = endY;
    }

    this._mouse_up = function(){
        this._get_restore_img();
        this._draw_flag = false;
    }

    this._mouse_leave = function(){
        this._get_restore_img();
        this._draw_flag = false;
    }

    this._draw_core = function(canvas,x,y,color,size,alpha,tool){
        var context;
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
        context.moveTo(this._startX, this._startY);
        context.lineTo(x, y);
        context.stroke();
        context.closePath();
    }

    //レイヤー、描くキャンバスを返す
    this._get_layer_num = function(){
        var select_canvas;
        $('#layerul li:nth-child(n)').each(function(){
            if ($(this).hasClass('active')){
                //select_canvas = "b_paint._canvas" + $(this).attr("id");
                switch($(this).attr("id")){
                case "1":
                    select_canvas = b_paint._canvas1;
                    break;
                case "2":
                    select_canvas = b_paint._canvas2;
                    break;
                case "3":
                    select_canvas = b_paint._canvas3;
                    break;
                }
            }
        });
        return select_canvas;

    }

    //color
    this._get_color = function(){
        return $("#newcolor").css("background-color");
    }

    //undo 描いた絵のキャンバスとイメージを取得
    this._get_undo_img = function(){
        var canvas_array = [b_paint._canvas1,b_paint._canvas2,b_paint._canvas3];
        for(var i=0; i < LAYER_N; i++){
            this._undo_context[i] = canvas_array[i].getContext('2d');
            this._undoImage[i] =
                this._undo_context[i].getImageData(0, 0, $('canvas').width(), $('canvas').height());
        }
    }

    // redo
    this._get_restore_img = function(){
        for(var i=0; i < LAYER_N; i++){
            this._restoreImage[i] =
                this._undo_context[i].getImageData(0, 0, $('canvas').width(), $('canvas').height());
        }

    }

    // 描いている絵を全消去
    this.clear_canvas = function(){
        for(var i=0; i < LAYER_N; i++){
            this._undo_context[i].clearRect(0, 0, $('canvas').width(), $('canvas').height());
        }
    }

    // キャンバス保存、またはイメージURLを返す
    this._save_or_send_image = function(layer_n,which){
        var canvas = b_paint._canvasSave;
        var context = canvas.getContext("2d");
        var canvas_array = [b_paint._canvas1,b_paint._canvas2,b_paint._canvas3];
        inner_rec(layer_n);

        function inner_rec(layer_n){
            if(layer_n<=0){
                var d = canvas.toDataURL('image/png');
                if(which == 1){ // 保存
                    d = d.replace('image/png', 'image/octet-stream');
                    window.open(d, 'save');
                    context.clearRect(0, 0, $('canvas').width(), $('canvas').height());
                }else if(which == 2){// 次の人に絵を伝える
                    // var draw_start_Date = new Date();　// 次の人の描きはじめの時間は、前の人の描き終わった時間
                    // b_sync.emit_drawfin(b_user._user,b_user._order_list,draw_start_Date,d);
                    b_sync.emit_drawfin(b_user._user,b_user._order_list,d); // test
                    context.clearRect(0, 0, $('canvas').width(), $('canvas').height());
                }
            }else{
                var d = canvas_array[layer_n-1].toDataURL().replace('image/png', 'image/octet-stream');
                var img = new Image();
                img.src = d;
                img.onload = function(){
                    layer_n -=1;
                    context.drawImage(img,0,0);
                    inner_rec(layer_n);
                }
            }
        }
    }


}