{
    let mSocket;

    var sync = {
        init: function(){
            //接続
            mSocket = io.connect('http://'+location.host+'/room',
                                 {'sync disconnect on unload' : true});

            this.syncOnInit(mSocket);
        },

        //socket.onしたら
        syncOnInit: function(socket){
            socket.on('connect', function(data) {
                sync.emitInit();
            });

            socket.on('firstconnect',function(data){
                if(data.user == user.getMuser()){
                    sync.emitLogin(user.getMuser());
                }
            });

            // ゲーム中、途中から入ってきたときにゆーざのりすとが更新されてしまう
            socket.on('login', function(data){
                if(data.users[0] == user.getMuser()){
                    sync.forNewLoginUser(data);
                }
                user.setMusers(data.users.concat());

                if(game.mode.gaming || game.mode.finish){
                    user.setMorderList(data.orderlist.concat());
                    game.setFinalTime(game.getMdrawTime(),data.gameStartDate,user.getMorderList().length); // 誰かが入ってきたら終了時間を更新

                    game.setDrawStartTime(user.getMorderList(),data.nextuser);
                    game.changeDrawingUserColor(data.nextuser);
                }else{
                    sync.updateLoginDrawingList(data);
                }
                let addcomment = data.users[0] + "さんがログインしました。";
                let userList = user.getMuserList().concat();
                chat.writeComment(addcomment);
                game.renewalHost(data.hostname);
                if(game.getMisHost() && game.mode.setting){
                    //ホストのログインユーザを更新
                    userList.unshift(data.users[0]);
                    user.setMuserList(userList);
                    user.updateUserList(userList,"drawuserNum","canvasusernameArea");
                    game.canStartGame(userList.length);
                }
            });

            // 描いてる人が消えた時に、描く時間がおかしい
            // 終了時間がおかしい
            socket.on('disconnect',function(data){
                if(data.user){
                    user.setMusers(data.users.concat())
                    if(game.mode.gaming || game.mode.finish){
                        user.setMorderList(data.orderlist.concat());
                        game.setFinalTime(game.getMdrawTime(),data.gameStartDate,user.getMorderList().length); // 誰かが抜けたら終了時間を更新
                    }

                    sync.updateLoginDrawingList(data);

                    let addcomment = data.user + "さんがログアウトしました。";
                    chat.writeComment(addcomment);

                    game.renewalHost(data.hostname);

                    if (game.getMisHost() && game.mode.setting){ //ホストの設定中、ログインユーザを更新
                        let userList = user.getMuserList().concat();
                        let mUserListDelNum =
                            user.returnDeleteUserNum(data.user,userList);
                        if(mUserListDelNum != null){
                            userList.splice(mUserListDelNum,1);
                            user.setMuserList(userList);
                            user.updateUserList(userList,"drawuserNum","canvasusernameArea");
                        }else{
                            let orderList = user.getMorderList().concat();
                            var mOrderListDelNum =
                                user.returnDeleteUserNum(data.user,orderList);
                            orderList.splice(mOrderListDelNum,1);
                            user.setMorderList(orderList);
                            user.updateUserList(orderList(),"orderuserNum","canvasordernameArea");
                        }
                        game.canStartGame(userList.length);
                    }
                }
            });

            // コメント
            socket.on('comment',function(data){
                var addcomment = data.user + "：" + data.comment;
                chat.writeComment(addcomment);
            });

            // ホスト
            socket.on('host',function(data){
                $('#host').css({"visibility":"hidden"});
                game.changeMode("setting",data.hostname);
            });

            // ゲーム開始
            socket.on('order',function(data){// 右に表示されるのはorderlist
                let orderList = user.getMorderList().concat();
                game.changeMode("gaming",null);
                game.changeUserListLabel();
                orderList = data.list.concat();
                user.setMorderList(orderList);
                user.updateLoginUsers(orderList);
                layer.clearCanvas();
                paint.setMisDrawable(false);
                game.setMdrawTime(data.drawtime);
                game.setFinalTime(game.getMdrawTime(),data.gameStartDate,orderList.length);

                let firstNum = orderList.length - 1;
                game.changeDrawing(orderList[firstNum]);
                game.setMdrawStartDate(data.drawStartDate);
                game.setDrawStartTime(orderList,orderList[firstNum]);
                game.changeDrawingUserColor(orderList[firstNum]);
            });

            // 誰かが描き終わる
            socket.on('drawfin',function(data){
                game.setMimgListMusers(data.imgListUser);
                game.setMimgListMimgs(data.imgListImg);
                game.changeDrawing(data.nextuser);
                if(!data.isFirstDeleted){ // 消えたのが最初のユーザでない場合は、前の人の絵を設定
                    game.drawBeforeUserImg(game.getMimgListMimgs()[0],data.nextuser);
                }
                game.setMdrawStartDate(data.drawStartDate);
                game.setDrawStartTime(user.getMorderList(),data.nextuser);
                game.changeDrawingUserColor(data.nextuser);
            });

            // ゲーム終了
            socket.on('gamefin',function(data){
                layer.getUndoImg();
                game.changeMode("finish",null);
                game.changeDrawing("none");
                user.updateLoginUsers(user.getMorderList());
                $('#toimg').css({"visibility":"visible"});
                if(game.getMisHost()){
                    $('#newgame').css({"visibility":"visible"});
                }
            });

            // NEWGAME
            socket.on('newgame',function(data){
                paint.setMisDrawable(true);
                game.changeMode("wait",null);
                game.changeFinishTime(0,0);
                game.changeUserListLabel();
                $('#toimg').css({"visibility":"hidden"});
                $("#canvasusernameArea").empty();
                $("#canvasordernameArea").empty();
                user.updateLoginUsers(user.getMusers());
                user.setMorderList([]);
                user.setMuserList([]);
                if(game.getMisHost()){
                    $('#host').css({"visibility":"visible"});
                }
            });
        },

        //emit

        // ログインを伝える
        emitLogin :function(user){
            mSocket.emit('login',{
                user: user,
            });
        },

        // コメント送信
        emitComment :function(comment,user){
            mSocket.emit('comment',{
                comment: comment,
                user: user,
            });
        },

        // ホストを伝える
        emitHost :function(isClickHost,hostname){
            mSocket.emit('host',{
                isClickHost: isClickHost,
                hostname: hostname,
            });
        },

        // 描く順番を伝える
        emitOrder :function(list,drawtime){
            mSocket.emit('order',{
                list: list,
                drawtime: drawtime,
            });
        },

        // 描き終わったことを伝える
        emitDrawFin :function(finuser,list,img){
            mSocket.emit('drawfin',{
                finuser: finuser,
                list: list,
                img: img,
            });
        },

        // NEWGAMEを伝える
        emitNewGame :function(){
            mSocket.emit('newgame',{
                newGame: true,
            });
        },

        // room

        // roomと名前を伝える
        emitInit :function(){
            console.log("user.getMuser(): "+user.getMuser());
            mSocket.emit('init',{
                room: room.getQuerystring('room'),
                name: user.getMuser()
            });
        },

        //同期の関数

        // 入って來た人のため
        forNewLoginUser :function(data){
            switch(data.mode){
            case 0: // 待機中
                game.changeMode("wait",null);
                break;
            case 1://設定中
                let modetext = data.hostname + "さんが設定中です";
                game.changeMode("setting",modetext);
                break;
            case 2://オーダできたら、://誰かが描いてる途中だったら
                game.changeMode("gaming",null);
                paint.setMisDrawable(false);
                game.setMdrawTime(data.drawtime);
                game.changeUserListLabel();
                game.changeDrawing(data.nextuser);
                game.setMdrawStartDate(data.drawStartDate);
                break;
            case 3://ゲームが終わったら
                game.changeMode("finish",null);
                break;
            }
        },

        updateLoginDrawingList :function(data){
            if(game.mode.wait){
                user.updateLoginUsers(user.getMusers());
            }else if(game.mode.setting){
                user.updateLoginUsers(user.getMusers());
            }else if(game.mode.gaming){ // orderlistはgaming,finishの間共通
                user.updateLoginUsers(user.getMorderList());
                game.setMdrawStartDate(data.drawStartDate);
                game.setDrawStartTime(user.getMorderList(),data.nextuser);
                game.changeDrawingUserColor(data.nextuser)
            }else if(game.mode.finish){
                user.updateLoginUsers(user.getMorderList());
            }
        }
    };
}