{
    var checkEnter = {

        init: function(){
            var username = $('#nameArea').val();
            var roomname = decodeURI(room.getQuerystring('room'));
            var isOriginalName = true;

            for(var i=0; i < room.getMroomData().length; i++){
                if(room.getMroomData()[i].roomname != roomname){
                    continue;
                }
                for(var j=0; j < room.getMroomData()[i].users.length; j++){
                    if(room.getMroomData()[i].users[j] == username){
                        isOriginalName = false;
                        break;
                    }
                }
            }

            if(username == ""){
                alert("入力されていません");
                return false;
            }else if(!isOriginalName){
                alert("同じ名前のユーザーがいます");
                return false;
            }else{
                let toroomName = "/room?room=" + room.getQuerystring('room');
                $('#toroom').attr('action',toroomName);
                return true;
            }
        }
    };
}