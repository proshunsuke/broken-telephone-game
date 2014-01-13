{ // キーイベント

    var keypressEvent = {

        init: function(){

            $('#commentarea').live('keypress',function (e) {
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
        }
    };
}