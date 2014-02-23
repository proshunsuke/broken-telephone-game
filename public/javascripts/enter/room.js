{

    let mRoomLength;
    let mRoomName;
    let mUsers;

    var room = {

        //getter

        getMroomLength: function(){
            return mRoomLength;
        },

        getMroomName: function(){
            return mRoomName;
        },

        getMusers: function(){
            return mUsers;
        },

        // setter

        setMroomLength: function(roomLength){
            mRoomLength = roomLength;
        },

        setMroomName: function(roomName){
            mRoomName = roomName.concat();
        },

        setMusers: function(users){
            mUsers = users.concat();
        },

        init: function(){
            mRoomLength = 0;
            mRoomName = [];
            mUsers = [];
        },

        getQuerystring: function(key, default_){
            if (default_==null) default_="";
            key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
            var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
            var qs = regex.exec(window.location.href);
            if(qs == null)
                return default_;
            else
                return qs[1];
        }
    };
}