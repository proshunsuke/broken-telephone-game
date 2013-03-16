function Sync(){
    this._socket;

    this.init = function(){
        //接続
        this._socket = io.connect('http://'+location.host+'/room',
                                  {'sync disconnect on unload' : true});

        sync_on_init(this._socket);

    }

    //socket.onしたら
    function sync_on_init(socket){
        socket.on('connect', function(data) {
            b_sync.emit_init();
        });

        socket.on('firstconnect',function(data){
            console.log("data.user:",data.user,",user:",b_user._user);
            if(data.user == b_user._user){
                b_sync.emit_login(b_user._user);
            }
        });

        // ゲーム中、途中から入ってきたときにゆーざのりすとが更新されてしまう
        // modeで分けて、ろぐいんゆーざを更新するのかかく順番で更新するのかはっきりさせる必要がある
        socket.on('login', function(data){
            if(data.users[0] == b_user._user){
                b_sync.for_newlogin_user(data);
            }

            b_user._users = data.users.concat();
            console.log("サーバから送られたユーザリスト:",b_user._users);
            if(b_game._mode.gaming || b_game._mode.finish){
                b_user._order_list = data.orderlist.concat();
            }

            b_sync.update_login_drawing_list(data);

            var addcomment = data.users[0] + "さんがログインしました。";
            b_chat.write_comment(addcomment);

            b_game.renewal_host(data.hostname);

            if(b_game._isHost && b_game._mode.setting){
                //ホストのログインユーザを更新
                b_user._user_list.unshift(data.users[0]);
                b_user.updateUserList(b_user._user_list,"drawuserNum","canvasusernameArea");
                b_game.can_start_game(b_user._user_list.length);
            }

        });

        socket.on('disconnect',function(data){
            // var users_del_num = b_user.return_deleteUser_num(data.user,b_user._users);
            // var orderlist_del_num = b_user.return_deleteUser_num(data.user,b_user._order_list);
            // b_user._users.splice(users_del_num,1);
            // b_user._order_list.splice(orderlist_del_num,1);
            if(data.user){
                b_user._users = data.users.concat();
                if(b_game._mode.gaming || b_game._mode.finish){
                    b_user._order_list = data.orderlist.concat();
                }

                b_sync.update_login_drawing_list(data);

                var addcomment = data.user + "さんがログアウトしました。";
                b_chat.write_comment(addcomment);

                b_game.renewal_host(data.hostname);

                if (b_game._isHost && b_game._mode.setting){ //ホストの設定中、ログインユーザを更新
                    var userlist_del_num =
                        b_user.return_deleteUser_num(data.user,b_user._user_list);
                    if(userlist_del_num != null){
                        b_user._user_list.splice(userlist_del_num,1);
                        b_user.updateUserList(b_user._user_list,"drawuserNum","canvasusernameArea");
                    }else{
                        var orderlist_del_num =
                            b_user.return_deleteUser_num(data.user,b_user._order_list);
                        b_user._order_list.splice(orderlist_del_num,1);
                        b_user.updateUserList(b_user._order_list,"orderuserNum","canvasordernameArea");
                    }
                    b_game.can_start_game(b_user._user_list.length);
                }
            }
        });

        // コメント
        socket.on('comment',function(data){
            var addcomment = data.user + "：" + data.comment;
            b_chat.write_comment(addcomment);
        });

        // ホスト
        socket.on('host',function(data){
            $('#host').css({"visibility":"hidden"});
            b_game.change_mode("setting",data.hostname);
        });

        // ゲーム開始
        socket.on('order',function(data){// 右に表示されるのはorderlist
            b_game.change_userlist_label();
            b_game.change_mode("gaming",null);
            b_user._order_list = data.list.concat();
            b_user.updateLoginUsers(b_user._order_list);
            b_paint.clear_canvas();
            b_paint._isDrawable = false;
            b_game._drawtime = data.drawtime;
            b_game.setFinalTime(b_game._drawtime,b_user._order_list.length);

            var first_num = b_user._order_list.length - 1;
            b_game.change_drawing(b_user._order_list[first_num]);
            b_game.change_drawinguser_color(b_user._order_list[first_num]);
        });

        // 誰かが描き終わる
        socket.on('drawfin',function(data){
            // b_game._img_list = data.imglist.concat();
            b_game._img_list._users = data.imglist_user.concat();
            b_game._img_list._imgs = data.imglist_img.concat();
            console.log("誰かが描き終わり");
            console.log(data);
            console.log(b_game._img_list);
            b_game.change_drawing(data.nextuser);
            if(!data.isFirstDeleted){
                b_game.draw_beforeuser_img(b_game._img_list._imgs[0],data.nextuser);
            }
            b_game.change_drawinguser_color(data.nextuser)
        });

        // ゲーム終了
        socket.on('gamefin',function(data){
            b_paint._get_undo_img();
            b_game.change_mode("finish",null);
            b_game.change_drawing("none");
            $('#toimg').css({"visibility":"visible"});
            if(b_game._isHost){
                $('#newgame').css({"visibility":"visible"});
            }
        });

        // NEWGAME
        socket.on('newgame',function(data){
            b_paint._isDrawable = true;
            b_game.change_mode("wait",null);
            b_game.change_finish_time(0,0);
            b_game.change_userlist_label();
            $('#toimg').css({"visibility":"hidden"});
            $("#canvasusernameArea").empty();
            $("#canvasordernameArea").empty();
            b_user.updateLoginUsers(b_user._users);
            b_user._order_list = [];
            b_user._user_list = [];
            if(b_game._isHost){
                $('#host').css({"visibility":"visible"});
            }
        });





    }




    //emit

    // ログインを伝える
    this.emit_login = function(user){
        this._socket.emit('login',{
            user: user,
        });
    }

    // コメント送信
    this.emit_comment = function(comment,user){
        this._socket.emit('comment',{
            comment: comment,
            user: user,
        });
    }

    // ホストを伝える
    this.emit_host = function(isClickHost,hostname){
        this._socket.emit('host',{
            isClickHost: isClickHost,
            hostname: hostname,
        });
    }

    // 描く順番を伝える
    this.emit_order = function(list,drawtime){
        this._socket.emit('order',{
            list: list,
            drawtime: drawtime,
        });
    }

    // 描き終わったことを伝える
    this.emit_drawfin = function(finuser,list,img){
        this._socket.emit('drawfin',{
            finuser: finuser,
            list: list,
            img: img,
        });
    }

    // NEWGAMEを伝える
    this.emit_newgame = function(){
        this._socket.emit('newgame',{
            new: true,
        });
    }

    // room
    // roomと名前を伝える
    this.emit_init = function(){
        this._socket.emit('init',{
            room: b_room.getQuerystring('room'),
            name: b_user._user
        });
    }

    //同期の関数

    // 入って來た人のため
    this.for_newlogin_user = function(data){
        switch(data.mode){
        case 0: // 待機中
            b_game.change_mode("wait",null);
            break;
        case 1://設定中
            var modetext = data.hostname + "さんが設定中です";
            b_game.change_mode("setting",modetext);
            break;
        case 2://オーダできたら、://誰かが描いてる途中だったら
            b_game.change_mode("gaming",null);
            b_paint._isDrawable = false;
            b_game._drawtime = data.drawtime;
            b_game.change_userlist_label();
            b_game.change_drawing(data.nextuser);
            b_game.setFinalTime(b_game._drawtime,b_user._order_list.length);
            break;
        case 3://ゲームが終わったら
            b_game.change_mode("finish",null);
            break;
        }
    }

    this.update_login_drawing_list = function(data){
        if(b_game._mode.wait){
            b_user.updateLoginUsers(b_user._users);
        }else if(b_game._mode.setting){
            b_user.updateLoginUsers(b_user._users);
        }else if(b_game._mode.gaming){ // orderlistはgaming,finishの間共通
            b_user.updateLoginUsers(b_user._order_list);
            b_game.change_drawinguser_color(data.nextuser)
        }else if(b_game._mode.finish){
            console.log(b_user._order_list);
            b_user.updateLoginUsers(b_user._order_list);
        }
    }


}