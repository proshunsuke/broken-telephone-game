var r_sync = new Sync();
var r_room = new Room();
function toInstance_init(){

    // イベント
    mouse_event_init();

    // インスタンス初期化
    r_sync.init();

}

// マウスイベント
function mouse_event_init(){

    // // 作る
    // $('#create').live('click',function(){
    //     var room_name = $('#room').val();
    //     var user_name = $('#name').val();
    //     if(room_name == "" || user_name == ""){
    //     }else{
    //         var room = "/room?room=" +  $('#room').val();
    //         $('#toroom').attr('action',room);
    //         console.log("");
    //         r_sync.emit_createroom(room_name,user_name);
    //     }
    // });

    // // 部屋に入る
    // $('#enter').live('click',function(){
    //     var room = "/room?room=" + r_room.getQuerystring('room');
    //     $('#toroom').attr('action',room);

    // });

}

function check_create(){
    var room_name = $('#room').val();
    var user_name = $('#name').val();
    if(room_name == "" || user_name == ""){
        alert("入力されていません");
        return false;
    }else{
        var room = "/room?room=" +  $('#room').val();
        $('#toroom').attr('action',room);
        r_sync.emit_createroom(room_name,user_name);
        return true;
    }
}

function check_enter(){
    var user_name = $('#nameArea').val();
    if(user_name == ""){
        alert("入力されていません");
        return false;
    }else{
        var room = "/room?room=" + r_room.getQuerystring('room');
        $('#toroom').attr('action',room);
        return true;
    }
}

function sleep( T ){
   var d1 = new Date().getTime();
   var d2 = new Date().getTime();
   while( d2 < d1+1000*T ){    //T秒待つ
       d2=new Date().getTime();
   }
   return;
}
