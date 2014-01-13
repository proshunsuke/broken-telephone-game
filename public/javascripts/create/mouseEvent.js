{
    // マウスイベント
    var mouseEvent = {

        init: function(){

            // パスワードのチェックボックスがクリックされたら
            $('#toroom :checkbox').click(function(){
                var isl = $(this).attr("id");
                if($(this).attr("checked") == "checked"){ // 設定する
                    $('#password').removeAttr("disabled");
                }else{ // 設定しない
                    $('#password').attr('disabled','');
                    $('#password').val("");
                }
            });
        }
    };
}