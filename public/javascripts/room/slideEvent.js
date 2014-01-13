{    //スライドイベント

    var slideEvent = {

        init: function(){

            $("#slider").slider({
                min: 1,
                max: 100, // ブラシの最大サイズ
                value : 10,  // 最初のブラシサイズ
                slide : function(evt, ui){
                    let brushSize = paint.getMbrushSize();
                    brushSize = ui.value; // ブラシサイズを設定
                    paint.setMbrushSize(brushSize);
                    $("#bw").val(brushSize);
                }
            });
            $('#bw').val($('#slider').slider('value'));

            $('#slider2').slider({
                min: 1,
                max: 100,
                value : 100,  // 初期値（不透明）
                slide : function(evt, ui){
                    let alpha = ui.value;
                    let alphaSize = paint.getMalphaSize();
                    $('#alpha').val(alpha);
                    if(alpha == 100){
                        alphaSize = 1;
                    }else if(alpha <= 9){
                        alphaSize = '0.0' + alpha;
                    }else if(alpha >= 10){
                        alphaSize = '0.' + alpha;
                    };
                    paint.setMalphaSize(alphaSize);
                }
            });
            $('#alpha').val($('#slider2').slider('value'));
        }
    };
}