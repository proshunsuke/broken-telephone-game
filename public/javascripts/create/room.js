{

    let mRoomLength;
    let mRoomName;

    var room = {

        //getter

        getMroomLength: function(){
            return mRoomLength;
        },

        getMroomName: function(){
            return mRoomName;
        },

        // setter

        setMroomLength: function(roomLength){
            mRoomLength = roomLength;
        },

        setMroomName: function(roomName){
            mRoomName = roomName.concat();
        },

        init: function(){
            mRoomLength = 0;
            mRoomName = [];
        }
    };
}