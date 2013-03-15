function User(){
    this._user;
    this._users;
    this._user_list;
    this._order_list;

    this.init = function(){
        this._user = $('#yourname').attr('value');
        this._users = new Array();
        this._user_list = new Array();
        this._order_list = new Array();
    }

    // ログインユーザ欄更新
    this.updateLoginUsers = function(users){
        // for(var j = 0; j < users.length + 1; j++){
        //     $('#userNum'+j).remove();
        // }
        $('#usernameArea').empty();
        // for(var i in users){
        //     var num = users.length - i -1;
        //     var insertdiv = "<div id ='userNum"+num+"'>"+users[i]+"</div>";
        //     $('#usernameArea').prepend(insertdiv);
        // }
        for(var i=0; i < users.length; i++){
            //var num = users.length - i - 1;
            var insertdiv = "<div id ='userNum"+i+"'>"+users[i]+"</div>";
            $('#usernameArea').prepend(insertdiv);
        }
    }

    // ログアウトしたら、ユーザ更新
    this.return_deleteUser_num = function(logoutUser,users){
        for(var i = 0; i < users.length; i++){
            if(users[i] == logoutUser){
                return i;
            }
        }
        if(i == users.length){
            return null;
        }
    }

    // ホストで順番決める時に、ユーザのリスト更新.引数はログインユーザの配列、挿入するID、挿入先のID
    this.updateUserList = function(users,addidname,addprependname){
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


}