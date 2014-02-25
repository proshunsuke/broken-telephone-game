{ // キーイベント

    var keypressEvent = {

        init: function(){

            $('#commentPushArea').live('keypress',function (e) {
                if(e.keyCode == 13) {
                    box = $(this);
                    let t_val = $(box).val();

                    if(t_val.length > 0) {
                        sync.emitComment(t_val,user.getMuser());
                        $(box).val("");
                    }
                    e.preventDefault();
                }
            });

            // タイトルモーダルウィンドウ
            $('#setTitleModal').on('hidden.bs.modal', function (e) {
                sync.emitGameStart($("#inputTitle").val()); // タイトル送信
                $("#inputTitle").val("");
            })

            $('#inputTitle').live('keypress',function (e) {
                if(e.keyCode == 13) {
                    e.preventDefault();
                    $('#setTitleModal').modal('hide');
                }
            });

        }
    };
}