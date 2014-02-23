{
    var checkEnter = {

        init: function(){
            var username = $('#nameArea').val();
            var roomname = decodeURI(room.getQuerystring('room'));
            var isOriginalName = true;

            for(var i=0; i < room.getMroomLength; i++){
                if(room.getMroomName[i] != roomname){
                    continue;
                }
                for(var j=0; j < room.getMusers()[i].length; j++){
                    if(room.getMusers()[i][j] == username){
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