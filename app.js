 /**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , io = require('socket.io');

var partial = require('express-partials');

var app = express();

app.use(partial());

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.favicon(__dirname + '/public/favicon.ico', {
        maxAge: 2592000000
    }));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/contact', routes.contact);
app.get('/create',routes.create);
app.get('/enter',routes.enter);
app.post('/room',routes.room);

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

var model = require('./model');
var Room = model.Room;

var socket = require('socket.io').listen(server);

// assuming io is the Socket.IO server object
socket.configure(function () {
  socket.set("transports", ["xhr-polling"]);
  socket.set("polling duration", 10);
});


// クライアントのルームを返す
var return_client_room = function(client){
    var room;
    client.get('room',function(err,_room){
        room = _room;
    });
    return room;
}

// クライアントの名前を返す
var return_client_name = function(client){
    var name;
    client.get('name',function(err,_name){
        name = _name;
    });
    return name;
}



var paint_room = socket.of('/room').on('connection',function(client){

    Room.find({},function(err,roomdata){
        client.emit('connected',{
            roomdata: roomdata,
        });
    });

    client.on('createRoom',function(data){

        var newRoom = new Room();
        newRoom.roomname = data.room;
        newRoom.count = 1;
        newRoom.hostname = data.name;
        newRoom.mode = 0;
        newRoom.password = data.password;

        newRoom.save(function(err) {
            if (err) { console.log(err); }
            else{
                Room.find({},function(err,roomdata){
                    client.broadcast.emit('createRoom',{
                        roomdata: roomdata,
                    });
                });
            }
        });
    });

    client.on('init',function(req){
        client.set('room',req.room);
        client.set('name',req.name);
        client.join(req.room);
        paint_room.to(req.room).emit('firstconnect',{
            connect: true,
            user: req.name,
        });
    });

    client.on('disconnect',function(){
        var client_room = return_client_room(client);

        console.log(client.id + "が切断しました");
        if(client_room){

            Room.find({
                'roomname': decodeURI(client_room)
            },function(err,roomdata){

                var isDrawinguserDeleted = false;

                // 描いてる人が消えたら
                if(roomdata[0].mode == 2 && client.user == roomdata[0].nextuser){
                    for(var i = 0; i < roomdata[0].orderlist.length; i++){
                        if(roomdata[0].orderlist[i] == client.user){
                            var nextnum = i - 1;
                            roomdata[0].nextuser = roomdata[0].orderlist[nextnum];
                            roomdata[0].drawStartDate = new Date(); // 描き始める時間設定
                            isDrawinguserDeleted = true;
                            break;
                        }
                    }
                }

                // 消えた人が最初の人、かつ、描いている人だったら
                // 最初の人が消えると、次の人に絵を伝えられないための処理
                var isFirstDeleted = false;
                if(client.user == roomdata[0].orderlist[roomdata[0].orderlist.length-1] && isDrawinguserDeleted){
                    isFirstDeleted = true;
                }

                // 消えた人が最後の人、かつ、描いている人だったら
                var isLastDeleted = false;
                if(client.user == roomdata[0].orderlist[0] && isDrawinguserDeleted){
                    isLastDeleted = true;
                }


                // ユーザ消す
                delete_user(roomdata[0].users,client.user);
                if(roomdata[0].mode == 2 || roomdata[0].mode == 3){
                    delete_user(roomdata[0].orderlist,client.user);
                }

                // カウントをする
                roomdata[0].count = roomdata[0].users.length;

                // ホスト更新
                roomdata[0].hostname = roomdata[0].users[roomdata[0].users.length-1];

                // saveして渡す
                roomdata[0].save(function(err){
                    if(err){}
                    else{
                        // disconnect情報を渡す
                        paint_room.to(client_room).json.emit('disconnect',{
                            user: client.user,
                            users: roomdata[0].users,
                            orderlist: roomdata[0].orderlist,
                            gameStartDate: roomdata[0].gameStartDate,
                            drawStartDate: roomdata[0].drawStartDate,
                            nextuser: roomdata[0].nextuser,
                            hostname: roomdata[0].hostname,
                        });

                        // 描いてる人が消えたら
                        if(isDrawinguserDeleted){
                            console.log("daraw_start_Dateが変更された,disconnect: ",roomdata[0].drawStartDate);
                            if(isLastDeleted){
                                paint_room.to(client_room).emit('gamefin',{
                                    fin: true,
                                });
                            }else{
                                paint_room.to(client_room).emit('drawfin',{
                                    nextuser: roomdata[0].nextuser,
                                    imgListUser: roomdata[0].imgListUser,
                                    imgListImg: roomdata[0].imgListImg,
                                    isFirstDeleted: isFirstDeleted,
                                    drawStartDate: roomdata[0].drawStartDate
                                });
                            }
                        }

                        // カウント渡す
                        if(roomdata[0].count == 0){
                            Room.remove({
                                'roomname': decodeURI(client_room)
                            },function(err,roomdata){});
                        }else{
                            client.broadcast.emit('roomCount',{
                                count: roomdata[0].count,
                                room: client_room,
                                hostname: roomdata[0].hostname
                            });
                        }
                    }
                });
                isNewGame = false;
            });
        }

        var count = 0;
        for(var i in paint_room.clients(client_room)){
            count++;
        }

        // roomを消す
        if(count == 1){
            Room.remove({
                'roomname': decodeURI(client_room)
            },function(err,roomdata){
            });

            Room.find({},function(err,roomdata){
                client.broadcast.json.emit('createRoom',{
                    roomdata: roomdata,
                });
            });
            client.leave(client_room);
        }
    });

    client.on('login',function(data){
        var client_room = return_client_room(client);
        client.user = data.user;
        Room.find({
            'roomname': decodeURI(client_room)
        },function(err,roomdata){
            if(roomdata[0].mode == 2 || roomdata[0].mode == 3){
                roomdata[0].orderlist.unshift(data.user);
            }

            roomdata[0].users.unshift(data.user);
            roomdata[0].save(function(err) {
                if (err) { console.log(err); }
                else{
                    console.log("drawStartDateの値,login: ",roomdata[0].drawStartDate);
                    paint_room.to(client_room).emit('login',{
                        users: roomdata[0].users,
                        orderlist: roomdata[0].orderlist,
                        mode: roomdata[0].mode,
                        hostname: roomdata[0].hostname,
                        nextuser: roomdata[0].nextuser,
                        drawtime: roomdata[0].drawtime,
                        gameStartDate: roomdata[0].gameStartDate,
                        drawStartDate: roomdata[0].drawStartDate,
                    });
                }
            });
            roomdata[0].count = roomdata[0].users.length;

            client.broadcast.emit('roomCount',{
                count: roomdata[0].count,
                room: client_room,
            });
        });
    });

    client.on('order',function(data){
        var client_room = return_client_room(client);
        Room.find({
            'roomname': decodeURI(client_room)
        },function(err,roomdata){
            roomdata[0].mode = 2;
            roomdata[0].orderlist = data.list.concat();
            roomdata[0].drawtime = data.drawtime;
            var start_Date = new Date();
            // roomdata[0].gameStartDate = data.gameStartDate;
            // roomdata[0].drawStartDate = data.drawStartDate;
            roomdata[0].gameStartDate = start_Date;
            roomdata[0].drawStartDate = start_Date;
            roomdata[0].nextuser = client.user;
            roomdata[0].save(function(err) {
                if (err) { console.log(err); }
                else{
                    paint_room.to(client_room).emit('order',{
                        list: data.list,
                        drawtime: data.drawtime,
                        gameStartDate: start_Date,
                        drawStartDate: start_Date
                    });
                }
            });

        });
    });

    client.on('drawfin',function(data){
        var client_room = return_client_room(client);

        Room.find({
            'roomname': decodeURI(client_room)
        },function(err,roomdata){
            roomdata[0].mode = 2;
            roomdata[0].orderlist = data.list.concat();

            roomdata[0].imgListUser.unshift(data.finuser);
            roomdata[0].imgListImg.unshift(data.img);
            //roomdata[0].drawStartDate = data.drawStartDate;
            roomdata[0].drawStartDate = new Date();
            console.log("daraw_start_Dateが変更された,drawfin: ",roomdata[0].drawStartDate);
            for(var i = 0; i < roomdata[0].orderlist.length; i++){
                if(roomdata[0].orderlist[i] == data.finuser){
                    var nextnum = i - 1;
                    roomdata[0].nextuser = roomdata[0].orderlist[nextnum];
                    break;
                }
            }

            if(nextnum == -1 ){
                roomdata[0].mode = 3;
            }

            roomdata[0].save(function(err) {
                if (err) { console.log(err); }
                else{
                    paint_room.to(client_room).emit('drawfin',{
                        nextuser: roomdata[0].nextuser,
                        imgListUser: roomdata[0].imgListUser,
                        imgListImg: roomdata[0].imgListImg,
                        drawStartDate: roomdata[0].drawStartDate
                    });

                    if(nextnum == -1){
                        paint_room.to(client_room).emit('gamefin',{
                            fin: true,
                        });
                    }
                }
            });
        });
    });

    client.on('host',function(data){
        var client_room = return_client_room(client);
        Room.find({
            'roomname': decodeURI(client_room)
        },function(err,roomdata){
            roomdata[0].model = 1;
            roomdata[0].hostname = data.hostname;
            roomdata[0].save(function(err) {
                if (err) { console.log(err); }
                else{
                    paint_room.to(client_room).emit('host',{
                        isClickHost: data.isClickHost,
                        hostname: data.hostname,
                    });
                }
            });
        });
    });

    client.on('newgame',function(data){
        var client_room = return_client_room(client);
        Room.find({
            'roomname': decodeURI(client_room)
        },function(err,roomdata){
            roomdata[0].mode = 0;
            roomdata[0].orderlist =[];
            roomdata[0].drawtime = 0;
            roomdata[0].gameStartDate = 0;
            roomdata[0].drawStartDate = 0;
            roomdata[0].nextuser = "";
            roomdata[0].save(function(err) {
                if (err) { console.log(err); }
                else{
                    paint_room.to(client_room).emit('newgame',{
                        newGame: true,
                    });
                }
            });
        });
    });

    client.on('comment',function(data){
        var client_room = return_client_room(client);
        paint_room.to(client_room).emit('comment',{
            comment: data.comment,
            user: data.user,
        });
    });


    // その他関数
    function delete_user(list,user){
        for(var i = 0; i < list.length; i++){
            if(list[i] == user){
                list.splice(i,1);
            }
        }
    }
});
