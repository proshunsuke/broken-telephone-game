{

    let mRoomData;

    var room = {

        //getter

        getMroomData: function(){
            return mRoomData;
        },

        // setter

        setMroomData: function(roomData){
            mRoomData = roomData.concat();
        },

        init: function(){
            mRoomData = new Array();
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

        createRooms: function(roomdata){
            $('#rooms').empty();
            for(var i=0; i < roomdata.length; i++){
                var insertroom="<li class='span3 ' id='"+roomdata[i].roomName+"_li'><a id='"+
                    roomdata[i].roomName+"' class='thumbnail' href='javascript:void(0)'>"+
                    roomdata[i].roomName+"</a><h5 id='"+roomdata[i].roomName+"_hostName'>"+
                    roomdata[i].hostName+"</h5></li>";
                $('#rooms').prepend(insertroom);
                if(roomdata[i].password){
                    $('#'+roomdata[i].roomName).css("background-color","#FFFFB0");
                    $('#'+roomdata[i].roomName).attr('value','password');
                }
                this.renewalCount(roomdata[i].users.length,roomdata[i].roomName);
            }
        }
    };
}