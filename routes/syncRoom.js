/**
 * Created by shunsuke on 14/02/20.
 */

(function(){

    var model;
    var Room;
    var Image;
    var kIndexRoom;

    var sechash;

    var getClientName = function(client){
        client.get('name',function(err,name){
            return name;
        });
    }

    var getClientRoom = function(client){
        var tempRoom;
        client.get('room',function(err,room){
            tempRoom = room;
        });
        return tempRoom;
    }

    // その他関数
    var deleteUser = function(list,user){
        for(var i = 0; i < list.length; i++){
            if(list[i] == user){
                list.splice(i,1);
            }
        }
    }

    var addImageDB = function(imgList){
        var date = new Date();
        var mYear = date.getFullYear(); // 年
        var mMonth = date.getMonth() + 1; // 月
        var mDate = date.getDate(); // 日
        for(var i=0; i < imgList.length; i++){
            var newImage = new Image();

            newImage.img = imgList[i].img;
            newImage.user = imgList[i].user;
            newImage.title = imgList[i].title;
            newImage.year = mYear;
            newImage.month = mMonth;
            newImage.date = mDate;
            newImage.save(function(err) {
                if (err) { console.log(err); }
            });
        }
    }

    // emit

    var emitRoomInfo = function(paintRoom, client){
        Room.find({},function(err,roomData){
            // 各部屋のそれぞれの情報ごとに配列を作る
            var tempRoomLength = roomData.length;
            var tempRoomName = [];
            var tempHostName = [];
            var tempUsers = [];
            var tempIsPassword = [];
            for(var i=0; i < tempRoomLength; i++){
                tempRoomName.push(roomData[i].roomName);
                tempHostName.push(roomData[i].hostName);
                tempUsers.push(roomData[i].users);
                if(roomData[i].password){
                    tempIsPassword[i] = true;
                }else{
                    tempIsPassword[i] = false;
                }
            }
            paintRoom.socket(client.id).emit('roomInfo',{
                roomLength: tempRoomLength,
                roomName: tempRoomName,
                hostName: tempHostName,
                users: tempUsers,
                isPassword: tempIsPassword
            });
        });
    }

    var emitCreateRoom = function(paintRoom){
        // 各部屋のそれぞれの情報ごとに配列を作る
        Room.find({},function(err,roomData){
            var tempRoomLength = roomData.length;
            var tempRoomName = [];
            var tempHostName = [];
            var tempUsers = [];
            var tempIsPassword = [];
            for(var i=0; i < tempRoomLength; i++){
                tempRoomName.push(roomData[i].roomName);
                tempHostName.push(roomData[i].hostName);
                tempUsers.push(roomData[i].users);
                if(roomData[i].password){
                    tempIsPassword[i] = true;
                }else{
                    tempIsPassword[i] = false;
                }
            }
            paintRoom.to(kIndexRoom).emit('createRoom',{
                roomLength: tempRoomLength,
                roomName: tempRoomName,
                hostName: tempHostName,
                users: tempUsers,
                isPassword: tempIsPassword
            });
        });
    }

    var emitCanEnterRoom = function(paintRoom, client, canEnter){
        paintRoom.socket(client.id).emit('canEnterRoom',{
            canEnter: canEnter
        });
    }

    var emitInit = function(paintRoom, data){
        paintRoom.to(data.room).emit('firstconnect',{
            user: data.name
        });
    }

    var emitDisconnect = function(paintRoom, clientRoom, client, roomData){
        paintRoom.to(clientRoom).emit('disconnect',{
            user: client.user,
            users: roomData.users,
            orderList: roomData.orderList,
            gameStartDate: roomData.gameStartDate,
            drawStartDate: roomData.drawStartDate,
            nextUser: roomData.nextUser,
            hostName: roomData.hostName
        });
    }

    var emitRoomCount = function(paintRoom, clientRoom, roomData){
        paintRoom.to(kIndexRoom).emit('roomCount',{
            count: roomData.users.length,
            room: clientRoom,
            hostName: roomData.hostName
        });
    }

    var emitLogin = function(paintRoom, clientRoom, roomData){
        paintRoom.to(clientRoom).emit('login',{
            hostName: roomData.hostName,
            mode: roomData.mode,
            drawTime: roomData.drawTime,
            gameStartDate: roomData.gameStartDate,
            drawStartDate: roomData.drawStartDate,
            nextUser: roomData.nextUser,
            users: roomData.users,
            orderList: roomData.orderList
        });

    }

    var emitOrder = function(paintRoom, clientRoom, data){
        paintRoom.to(clientRoom).emit('order', {
            orderList: data.orderList
        });
    }

    var emitGameStart = function(paintRoom, clientRoom, orderList, drawTime, startDate){
        paintRoom.to(clientRoom).emit('gameStart',{
            orderList: orderList,
            drawTime: drawTime,
            gameStartDate: startDate,
            drawStartDate: startDate
        });
    }

    var emitHost = function(paintRoom, clientRoom, data){
        paintRoom.to(clientRoom).emit('host',{
            isClickHost: data.isClickHost,
            hostName: data.hostName
        });
    }

    var emitNewGame = function(paintRoom, clientRoom){
        paintRoom.to(clientRoom).emit('newgame');
    }

    var emitComment = function(paintRoom, clientRoom, data){
        paintRoom.to(clientRoom).emit('comment',{
            comment: data.comment,
            user: data.user
        });
    }

    var emitGameFin = function(paintRoom, clientRoom, title){
        paintRoom.to(clientRoom).emit('gamefin',{
            title: title
        });
    }

    var emitDrawFin = function(paintRoom, clientRoom, roomData, isFirstDeleted){
        paintRoom.to(clientRoom).emit('drawfin',{
            nextUser: roomData.nextUser,
            imgList: roomData.imgList,
            drawStartDate: roomData.drawStartDate,
            isFirstDeleted: isFirstDeleted
        });
    }

    syncRoom = {

        init: function(){
            // db
            model = require('../model');

            // dbのコレクション
            Room = model.Room;
            Image = model.Image;

            sechash = require('sechash');

            kIndexRoom = "indexRoom";
        },

        syncOnInit: function(client, paintRoom){

            // index
            client.on('initIndex',function(){
                client.set('room',kIndexRoom);
                client.set('name',client.id);
                client.join(kIndexRoom); // 接続したら必ずindexの部屋に入る
                emitRoomInfo(paintRoom, client);
            });

            // index, enter
            client.on('createRoom',function(data){
                var newRoom = new Room();
                newRoom.roomName = data.room;
                newRoom.hostName = data.name;
                newRoom.password = data.password;
                newRoom.mode = 0;

                newRoom.save(function(err) {
                    if (err) { console.log(err); }
                    else{ emitCreateRoom(paintRoom); }
                });
            });

            client.on('passwordInfo', function(data){
                Room.find({
                    'roomName': data.roomName
                },function(err,roomData){
                    if(sechash.testHashSync(data.password, roomData[0].password)){
                        emitCanEnterRoom(paintRoom, client, true);
                    }else{
                        emitCanEnterRoom(paintRoom, client, false);
                    }
                });
            });

            client.on('init',function(data){
                client.leave(kIndexRoom); // indexの部屋を出る
                client.set('room',data.room);
                client.join(data.room); // 新たに作られたroomの部屋に入る
                emitInit(paintRoom, data);
            });

            client.on('disconnect',function(){
                var clientRoom = getClientRoom(client);
                client.leave(clientRoom); // まず部屋から抜ける

                // 部屋にいる人が抜けたら
                if(clientRoom && clientRoom != kIndexRoom){
                    Room.find({
                        'roomName': decodeURI(clientRoom)
                    },function(err,roomData){
                        // ユーザ消す
                        deleteUser(roomData[0].users,client.user);

                        var isEmptyRoom = false;
                        // 部屋が空になったかどうか
                        if(roomData[0].users.length == 0){
                            isEmptyRoom = true;
                        }
                        // 部屋が空でなければ
                        if(!isEmptyRoom){
                            var isDrawinguserDeleted = false;

                            // 描いてる人が消えたら
                            if(roomData[0].mode == 2 && client.user == roomData[0].nextUser){
                                for(var i = 0; i < roomData[0].orderList.length; i++){
                                    if(roomData[0].orderList[i] == client.user){
                                        var nextnum = i - 1;
                                        roomData[0].nextUser = roomData[0].orderList[nextnum];
                                        roomData[0].drawStartDate = new Date(); // 描き始める時間設定
                                        isDrawinguserDeleted = true;
                                        break;
                                    }
                                }
                            }

                            // 消えた人が最初の人、かつ、描いている人だったら
                            // 最初の人が消えると、次の人に絵を伝えられないための処理
                            var isFirstDeleted = false;
                            if(client.user == roomData[0].orderList[roomData[0].orderList.length-1] && isDrawinguserDeleted){
                                isFirstDeleted = true;
                            }

                            // 消えた人が最後の人、かつ、描いている人だったら
                            var isLastDeleted = false;
                            if(client.user == roomData[0].orderList[0] && isDrawinguserDeleted){
                                isLastDeleted = true;
                            }

                            // ゲーム中もしくはゲーム終了時はorderListからも消す
                            if(roomData[0].mode == 2 || roomData[0].mode == 3){
                                deleteUser(roomData[0].orderList,client.user);
                            }

                            // ホスト更新
                            roomData[0].hostName = roomData[0].users[roomData[0].users.length-1];
                        }
                        // saveして渡す
                        roomData[0].save(function(err){
                            if(err){}
                            else{
                                // 部屋消す
                                if(isEmptyRoom){
                                    // 部屋を消す前に, 描いた絵をDBに保存
                                    addImageDB(roomData[0].imgList);
                                    Image.find({},function(err,imageData){
                                        console.log("Image:\n"+imageData);
                                    });
                                    Room.remove({
                                        'roomName': decodeURI(clientRoom)
                                    },function(err,roomdata){});
                                }else{
                                    // disconnect情報を渡す
                                    emitDisconnect(paintRoom, clientRoom, client, roomData[0])
                                    // 描いてる人が消えたら
                                    if(isDrawinguserDeleted){
                                        // 最後の人が消えたらゲーム終了
                                        if(isLastDeleted){
                                            emitGameFin(paintRoom, clientRoom);
                                        }else{ // 描き終えたことにして次の人へ
                                            emitDrawFin(paintRoom, clientRoom, roomData[0], isFirstDeleted);
                                        }
                                    }
                                    // カウント渡す
                                    emitRoomCount(paintRoom, clientRoom, roomData[0]);
                                }
                                // 部屋が無くなったり, 部屋の構成が変わったのでそれを知らせる
                                emitCreateRoom(paintRoom);
                            }
                        });
                    });
                }
                // クライアントに入っていた部屋を抜けてもらう
                client.leave(clientRoom);
            });

            client.on('login',function(data){
                var clientRoom = getClientRoom(client);
                client.user = data.user;
                Room.find({
                    'roomName': decodeURI(clientRoom)
                },function(err,roomData){
                    if(roomData[0].mode == 2 || roomData[0].mode == 3){
                        roomData[0].orderList.unshift(data.user);
                    }

                    roomData[0].users.unshift(data.user);
                    roomData[0].save(function(err) {
                        if (err) { console.log(err); }
                        else{
                            emitLogin(paintRoom,clientRoom, roomData[0]);
                            emitRoomCount(paintRoom,clientRoom,roomData[0]);
                        }
                    });
                });
            });

            // hostが設定を終えたら呼ばれる. 一番最初に描く人にタイトルを決めてもらうので
            // それをemit
            client.on('order', function(data){
                var clientRoom = getClientRoom(client);
                Room.find({
                    'roomName': decodeURI(clientRoom)
                }, function(err, roomData){
                    roomData[0].nextUser = client.user;
                    roomData[0].orderList = data.orderList.concat();
                    roomData[0].drawTime = data.drawTime;
                    roomData[0].save(function(err) {
                        if (err) { console.log(err); }
                        else{ emitOrder(paintRoom, clientRoom, data); }
                    });
                });
            });

            client.on('gameStart',function(data){
                var clientRoom = getClientRoom(client);
                Room.find({
                    'roomName': decodeURI(clientRoom)
                },function(err,roomData){
                    var startDate = new Date();
                    roomData[0].mode = 2;
                    roomData[0].nextUser = client.user;
                    roomData[0].gameStartDate = startDate;
                    roomData[0].drawStartDate = startDate;
                    roomData[0].title = data.title;
                    roomData[0].save(function(err) {
                        if (err) { console.log(err); }
                        else{ emitGameStart(paintRoom,clientRoom,roomData[0].orderList, roomData[0].drawTime,startDate); }
                    });
                });
            });

            client.on('drawfin',function(data){
                var clientRoom = getClientRoom(client);
                Room.find({
                    'roomName': decodeURI(clientRoom)
                },function(err,roomData){
                    roomData[0].mode = 2;
                    roomData[0].drawStartDate = new Date();
                    roomData[0].orderList = data.orderList.concat();

                    roomData[0].imgList.imgListUnshift(data.img, data.finuser, roomData[0].title);

                    for(var i = 0; i < roomData[0].orderList.length; i++){ // nextUser決める
                        if(roomData[0].orderList[i] == data.finuser){
                            var nextnum = i - 1;
                            roomData[0].nextUser = roomData[0].orderList[nextnum];
                            break;
                        }
                    }

                    roomData[0].save(function(err) {
                        if (err) { console.log(err); }
                        else{
                            emitDrawFin(paintRoom, clientRoom, roomData[0], false);
                            if(nextnum == -1){ // ゲーム終了
                                roomData[0].mode = 3;
                                emitGameFin(paintRoom, clientRoom, roomData[0].title);
                            }
                        }
                    });
                });
            });

            client.on('host',function(data){
                var clientRoom = getClientRoom(client);
                Room.find({
                    'roomName': decodeURI(clientRoom)
                },function(err,roomData){
                    roomData[0].hostName = data.hostName;
                    roomData[0].model = 1;
                    roomData[0].save(function(err) {
                        if (err) { console.log(err); }
                        else{ emitHost(paintRoom, clientRoom, data); }
                    });
                });
            });

            client.on('newgame',function(data){
                var clientRoom = getClientRoom(client);
                Room.find({
                    'roomName': decodeURI(clientRoom)
                },function(err,roomData){
                    roomData[0].mode = 0;
                    roomData[0].drawTime = 0;
                    roomData[0].gameStartDate = 0;
                    roomData[0].drawStartDate = 0;
                    roomData[0].nextUser = "";
                    roomData[0].orderList =[];
                    roomData[0].save(function(err) {
                        if (err) { console.log(err); }
                        else{ emitNewGame(paintRoom, clientRoom); }
                    });
                });
            });

            client.on('comment',function(data){
                var clientRoom = getClientRoom(client);
                emitComment(paintRoom, clientRoom, data);
            });
        }
    }
})();