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
        }
    };
}