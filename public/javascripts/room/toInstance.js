var r_sync = new Sync();
var r_room = new Room();
function toInstance_init(){

    // イベント
    mouse_event_init();

    // インスタンス初期化
    r_sync.init();
    r_room.init();

}

// マウスイベント
function mouse_event_init(){

    // パスワードのチェックボックスがクリックされたら
    $('#toroom :checkbox').click(function(){
        var isl = $(this).attr("id");
        console.log($(this).attr("checked"));
        if($(this).attr("checked") == "checked"){ // 設定する
            console.log("true");
            $('#password').removeAttr("disabled");

        }else{ // 設定しない
            console.log("false");
            $('#password').attr('disabled','');
            $('#password').val("");
        }

    });

    $('#rooms a').live('click',function(){
        var room_name = $(this).attr("id");

        if($(this).attr('value') == "password"){
            var pass_input = prompt("パスワードを入力してください","");


            for(var i=0; i < r_room._room_data.length; i++){
                if(r_room._room_data[i].room_name == room_name){
                    var password = r_room._room_data[i].password;
                }
            }

            if(password == pass_input){
                location.href = "/enter?room=" + $(this).attr("id");
            }else{
                console.log("password:",password);
                console.log(pass_input);
                alert("パスワードが間違っています");
            }

        }else{
            location.href = "/enter?room=" + $(this).attr("id");
        }
    });



}

function check_create(){
    var room_name = $('#room').val();
    var user_name = $('#name').val();
    var password = $('#password').val();
    var isOriginalName = true;

    for(var i=0; i < r_room._room_data.length; i++){
        console.log("roomdata:",r_room._room_data[i]);
        if(r_room._room_data[i].room_name == room_name){
            isOriginalName = false;
        }
    }

    if(room_name == "" || user_name == ""){
        alert("入力されていません");
        return false;
    }if(!isOriginalName){
        alert("同じ名前の部屋があります");
        return false;
    }else{
        var room = "/room?room=" +  $('#room').val();
        $('#toroom').attr('action',room);
        r_sync.emit_createroom(room_name,user_name,password);
        return true;
    }
}

function check_enter(){
    var user_name = $('#nameArea').val();
    var room_name = decodeURI(r_room.getQuerystring('room'));
    var isOriginalName = true;

    for(var i=0; i < r_room._room_data.length; i++){
        if(r_room._room_data[i].room_name = room_name){
            for(var j=0; j < r_room._room_data[i].users.length; j++){
                if(r_room._room_data[i].users[j] == user_name){
                    isOriginalName = false;
                    break;
                }
            }
            break;
        }
    }

    if(user_name == ""){
        alert("入力されていません");
        return false;
    }else if(!isOriginalName){
        alert("同じ名前のユーザーがいます");
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
