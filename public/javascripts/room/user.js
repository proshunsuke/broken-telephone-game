{

    let mUser;
    let mUsers;
    let mUserList;
    let mOrderList;
    let mDrawTimeList;

    var user = {

        // getter

        getMuser: function(){
            return mUser;
        },

        getMusers: function(){
            return mUsers;
        },

        getMuserList: function(){
            return mUserList;
        },

        getMorderList: function(){
            return mOrderList;
        },

        getMdrawTimeList: function(){
            return mDrawTimeList;
        },

        // setter

        setMusers: function(users){
            mUsers = users.concat();
        },

        setMuserList: function(userList){
            mUserList = userList.concat();
        },

        setMorderList: function(orderList){
            mOrderList = orderList.concat();
        },

        setMdrawTimeList: function(drawTimeList){
            mDrawTimeList = drawTimeList.concat();
        },

        init :function(){
            mUser = $('#yourname').attr('value');
            Users = new Array();
            mUserList = new Array();
            mOrderList = new Array();
            mDrawTimeList = new Array();
        },


        // ログインユーザ欄更新
        updateLoginUsers :function(users){
            $('#usernameArea').empty();
            for(var i=0; i < users.length; i++){
                var insertdiv = "<div id ='userNum"+i+"' style='display: inline-block;'>"+users[i]+"</div></br>";
                $('#usernameArea').prepend(insertdiv);
            }
        },

        // 描き始める時間を更新
        updateDrawTime :function(users,mDrawTimeList){
            $('#usernameArea').empty();
            for(var i=0; i < users.length; i++){
                var insertdiv = "<div id ='userNum"+i+"' style='display: inline-block;'>"+users[i]+"</div><div id ='drawTimeNum"+i+"' style='display: inline-block;'>: "+mDrawTimeList[i]+"</div></br>";
                $('#usernameArea').prepend(insertdiv);
            }
        },

        // ログアウトしたら、ユーザ更新
        returnDeleteUserNum :function(logoutUser,users){
            for(var i = 0; i < users.length; i++){
                if(users[i] == logoutUser){
                    return i;
                }
            }
            if(i == users.length){
                return null;
            }
        },

        // ホストで順番決める時に、ユーザのリスト更新.引数はログインユーザの配列、挿入するID、挿入先のID
        updateUserList :function(users,addidname,addprependname){
            for(var j = 0; j < users.length + 1; j++){
                $('#'+addidname+j).remove();
            }

            for(var i in users){
                var num = users.length - i -1;
                var insertdrawusername = "<div id='" + addidname + "" + num+"'>"+users[i]+"</div>";
                var insertprependid = "#" + addprependname;
                $(insertprependid).prepend(insertdrawusername);
            }
        }

    };
}