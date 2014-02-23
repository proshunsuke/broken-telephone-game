{

    var checkCreate = {


        init: function(){

            var roomname = $('#room').val();
            var username = $('#name').val();
            var password = $('#password').val();
            var isOriginalName = true;

            for(var i=0; i < room.getMroomLength(); i++){
                if(room.getMroomName()[i] == roomname){
                    isOriginalName = false;
                }
            }

            if(roomname == "" || username == ""){
                alert("入力されていません");
                return false;
            }if(!isOriginalName){
                alert("同じ名前の部屋があります");
                return false;
            }else{
                let toroomName = "/room?room=" +  $('#room').val();
                $('#toroom').attr('action',toroomName);
                sync.emitCreateRoom(roomname,username,password);
                return true;
            }
        }
    };
}