{
    // マウスイベント
    var mouseEvent = {

        init: function(){

            $('#rooms a').live('click',function(){
                let roomname = $(this).attr("id");
                room.setMenterRoomName(roomname);

                if($(this).attr('value') == "password"){
                    let passInput = prompt("パスワードを入力してください","");
                    room.setMpassword(passInput);
                    sync.emitPasswordInfo();
                }else{
                    location.href = "/enter?room=" + $(this).attr("id");
                }
            });
        }
    };
}