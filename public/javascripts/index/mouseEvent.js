{
    // マウスイベント
    var mouseEvent = {

        init: function(){

            $('#rooms a').live('click',function(){
                let roomname = $(this).attr("id");

                if($(this).attr('value') == "password"){
                    let passInput = prompt("パスワードを入力してください","");


                    for(var i=0; i < room.getMroomData().length; i++){
                        if(room.getMroomData()[i].roomname == roomname){
                            var password = room.getMroomData()[i].password;
                        }
                    }

                    if(password == passInput){
                        location.href = "/enter?room=" + $(this).attr("id");
                    }else{
                        alert("パスワードが間違っています");
                    }

                }else{
                    location.href = "/enter?room=" + $(this).attr("id");
                }
            });
        }
    };
}