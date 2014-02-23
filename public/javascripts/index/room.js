{
    let mRoomLength;
    let mRoomName;
    let mEnterRoomName;
    let mPassword;

    var room = {

        //getter

        getMroomLength: function(){
            return mRoomLength;
        },

        getMroomName: function(){
            return mRoomName;
        },

        getMenterRoomName: function(){
          return mEnterRoomName;
        },

        getMpassword: function(){
            return mPassword;
        },

        // setter

        setMroomLength: function(roomLength){
            mRoomLength = roomLength;
        },

        setMroomName: function(roomName){
            mRoomName = roomName.concat();
        },

        setMenterRoomName: function(enterRoomName){
            mEnterRoomName = enterRoomName;
        },

        setMpassword: function(password){
            mPassword = password;
        },

        init: function(){
            mRoomLength = 0;
            mRoomName = [];
        },

        renewalCount: function(count,room,hostName){
            var roomname = decodeURI(room);
            var insertcount = "<h5 id='"+roomname+"_count'>"+count+"人が参加中</5>";
            $('#'+roomname+'_count').empty();
            $('#'+roomname+'_li').append(insertcount);

            if(hostName){
                $('#'+roomname+'_hostName').html(hostName);
            }
        },

        createRooms: function(roomLength, users, roomName, hostName, isPassword){
            $('#rooms').empty();
            for(var i=0; i < roomLength; i++){
                var insertroom="<li class='span3 ' id='"+roomName[i]+"_li'><a id='"+
                    roomName[i]+"' class='thumbnail' href='javascript:void(0)'>"+
                    roomName[i]+"</a><h5 id='"+roomName[i]+"_hostName'>"+
                    hostName[i]+"</h5></li>";
                $('#rooms').prepend(insertroom);
                if(isPassword[i]){
                    $('#'+roomName[i]).css("background-color","#FFFFB0");
                    $('#'+roomName[i]).attr('value','password');
                }
                this.renewalCount(users[i].length,roomName[i]);
            }
        }
    };
}