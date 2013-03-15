 /**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , routesD = require('./routes/draw')
  , routesP = require('./routes/paint')
  , routesP2 = require('./routes/paint2')
  // , routesE = require('./routes/enter')
  // , routesA = require('./routes/about')
  // , routesC = require('./routes/contact')
//  , routesCR = require('./routes/create')
  // , routesEN = require('./routes/enter')
  // , routesR = require('./routes/room')
  , routesT = require('./routes/top')
  , routesTC = require('./routes/top/create')
  , routesTL = require('./routes/top/login')
  , routesTR = require('./routes/top/room')
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
    //app.use(express.favicon());
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
app.get('/users', user.list);
app.post('/draw', routesD.draw);
//app.post('/enter',routesE.enter);
app.post('/paint', routesP.paint);
app.post('/paint2', routesP2.paint2);
app.get('/about', routes.about);
app.get('/contact', routes.contact);
app.get('/create',routes.create);//test
app.get('/enter',routes.enter);
app.post('/room',routes.room);
app.get('/top', routesT.top);
app.post('/top', routesT.top);
app.get('/top/create', routesTC.create);
app.post('/top/login', routesTL.login);
app.get('/top/login', routesTL.login);
app.post('/top/room', routesTR.room);
app.get('/top/room', routesTR.room);


// http.createServer(app).listen(app.get('port'), function(){
//   console.log("Express server listening on port " + app.get('port'));
// });

// io = require('socket.io');

// var socket = io.listen(app);
// socket.on('connection',function(client){
//     client.on('message',function(data){
//         client.broadcast(data);
//     });
// });

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

var model = require('./model');
var User = model.User
var Room = model.Room;


// var users = [];
// var orderlist = [];
// var mode = 0;
// var drawtime = 0;
// var hostname = "";
// var nextuser = "";

var socket = require('socket.io').listen(server);

// assuming io is the Socket.IO server object
socket.configure(function () {
  socket.set("transports", ["xhr-polling"]);
  socket.set("polling duration", 10);
});

// socket.on('connection',function(client){

//     client.on('login',function(data){
//         users.unshift(data.user);
//         console.log("users:",users);
//         if(mode == 2 || mode == 3){
//             console.log(orderlist);
//             orderlist.unshift(data.user);
//             console.log(orderlist,"eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
//         }
//         client.user = data.user;
//         client.json.emit('login',{
//             users: users,
//             orderlist: orderlist,
//             mode: mode,
//             hostname: hostname,
//             nextuser: nextuser,
//             drawtime: drawtime,
//         });
//         client.broadcast.json.emit('login',{
//             users: users,
//             orderlist: orderlist,
//         });
//     });

//     client.on('disconnect',function(){
//         console.log(client.id + "が切断しました");

//         delete_user(users,client.user);
//         if(mode == 2 || mode == 3){
//             console.log("更新前orderlist:",orderlist);
//             delete_user(orderlist,client.user);
//             console.log("更新後orderlist:",orderlist);
//         }


//         client.broadcast.json.emit('disconnect',{
//             user: client.user,
//             users: users,
//             orderlist: orderlist,
//         });

//         if(client.user == hostname){
//             mode = 0;
//             hostname = "";
//             orderlist =[];
//             drawtime = 0;
//             nextuser = "";

//             client.broadcast.json.emit('newgame',{
//                 new: true,
//             });
//         }
//     });

//     client.on('message',function(event){
//         client.json.emit('message',{
//             act: event.act,
//             x: event.x,
//             y: event.y,
//             color: event.color,
//             size: event.size
//         });
//         client.broadcast.json.emit('message',{
//             act: event.act,
//             x: event.x,
//             y: event.y,
//             color: event.color,
//             size: event.size
//         });
//     });

//     client.on('order',function(data){
//         mode = 2;
//         orderlist = data.list.concat();
//         drawtime = data.drawtime;
//         client.json.emit('order',{
//             list: data.list,
//             drawtime: data.drawtime,
//         });
//         client.broadcast.json.emit('order',{
//             list: data.list,
//             drawtime: drawtime,
//         });
//     });

//     var imglist;
//     client.on('drawfin',function(data){
//         mode = 2;
//         orderlist = data.list.concat();
//         imglist = data.imglist.concat();
//         console.log(orderlist);
//         for(var i = 0; i < orderlist.length; i++){
//             if(orderlist[i] == data.finuser){
//                 var nextnum = i - 1;
//                 nextuser = orderlist[nextnum];
//                 client.json.emit('drawfin',{
//                     nextuser: nextuser,
//                     beforeimg: imglist,
//                 });
//                 client.broadcast.json.emit('drawfin',{
//                     nextuser: nextuser,
//                     beforeimg: imglist,
//                 });
//                 break;
//             }
//         }
//         if(nextnum == -1 ){
//             mode = 3;
//             client.json.emit('gamefin',{
//                 fin: true,
//             });
//             client.broadcast.json.emit('gamefin',{
//                 fin: true,
//             });
//         }
//     });

//     client.on('host',function(data){
//         mode = 1;
//         hostname = data.hostname;
//         client.json.emit('host',{
//             isClickHost: data.isClickHost,
//             hostname: data.hostname,
//         });
//         client.broadcast.json.emit('host',{
//             isClickHost: data.isClickHost,
//             hostname: data.hostname,
//         });
//     });

//     client.on('newgame',function(data){
//         mode = 0;
//         hostname = "";
//         orderlist =[];
//         drawtime = 0;
//         nextuser = "";

//         client.json.emit('newgame',{
//             new: true,
//         });
//         client.broadcast.json.emit('newgame',{
//             new: true,
//         });
//     });

//     client.on('comment',function(data){
//         client.json.emit('comment',{
//             comment: data.comment,
//             user: data.user,
//         });
//         client.broadcast.json.emit('comment',{
//             comment: data.comment,
//             user: data.user,
//         });
//     });







//     function delete_user(list,user){
//         for(var i = 0; i < list.length; i++){
//             if(list[i] == user){
//                 list.splice(i,1);
//             }
//         }
//     }








// });


// var roomstest = new Array();
// // ここからテスト
// var chat = socket.of('/top').on('connection',function(client){

//     client.emit('connected',{
//         rooms: roomstest,
//     });

//     client.on('disconnect',function(){
//         var room, name;

//         client.get('room', function(err, _room) {
//             room = _room;
//         });
//         client.get('name', function(err, _name) {
//             name = _name;
//         });
//         var count = 0;
//         for(var i in chat.clients(room)){
//             console.log(chat.clients(room)[i].id + "disconnected:"+ chat.clients(room)[i].disconnected);
//             count++;
//         }

//         if(count == 1){
//             for(var i=0; i < roomstest.length; i++){
//                 console.log("rooms",roomstest[i]);
//                 console.log("room",room);

//                 if(encodeURI(roomstest[i]) == room){
//                     roomstest.splice(i,1);
//                 }
//             }
//             client.broadcast.json.emit('createroom',{
//                 rooms: roomstest,
//             });
//         }
//         client.broadcast.json.emit('createroom',{
//                 rooms: roomstest,
//             });

//         client.leave(room);
//         chat.to(room).emit('chatmessage', name + " さんが退出");

//         console.log("全ルームのハッシュ:",chat.manager.roomstest);
//     });

//     client.on('init',function(req){
//         console.log("initきてる");
//         console.log("room:",req.room);
//         console.log("name:",req.name);

//         client.set('room',req.room);
//         client.set('name',req.name);
//         chat.to(req.room).emit('chatmessage',{
//             text: req.name + "さんが入室しました",
//         });

//         client.join(req.room);
//     });

//     client.on('createroom',function(data){
//         roomstest.unshift(data.room);
//         console.log("rooms:",roomstest);
//         client.broadcast.json.emit('createroom',{
//             rooms: roomstest,
//         });
//     });

//     client.on('chatmessage',function(req){
//         var room, name;

//         client.get('room',function(err,_room){
//             room = _room;
//         });
//         client.get('name',function(err,_name){
//             name = _name;
//         });
//         console.log("room:",room);
//         console.log("name:",name);

//         chat.to(room).emit('chatmessage',{
//             text: name+":"+req.text,
//         });
//     });

// });

// var rooms = new Array();
// var creaters = new Array();
// var counts = new Array();


// var room_users = [];
// var room_orderlist = [];
// var room_mode = [];
// var room_drawtime = [];
// var room_hostname = [];
// var room_nextuser = [];
// var room_imglist = [];
// var room_count = [];


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

// ルームを渡すとハッシュを作成
// ルームをキーとしたハッシュに、配列とかの値
// var create_paint_set = function(room){
//     room_users[room] = new Array();
//     room_orderlist[room] = new Array();
//     room_mode[room] = 0;
//     room_drawtime[room] = 0;
//     room_hostname[room] = "";
//     room_nextuser[room] = "";
//     room_imglist[room] = [];
//     room_count[room] = 0;


//     // room_users[room][0] = "test0";
//     // room_users[room][1] = "test1"
//     // for(var i in room_users){
//     //     console.log(i,":",room_users[i]);
//     // }
//     // for(var j=0; j < room_users[room].length; j++){
//     //     console.log(j,":",room_users[room][j]);
//     // }
// }

// ユーザとイメージの関係を結びつけるクラス
function Oekaki_list(){

    this._users = new Array();
    this._imgs = new Array();

    this.add_user_img = function(user,img){
        this._users.unshift(user);
        this._imgs.unshift(img);
    };

    this.recent_user_img = function(user){
        for(var i=0; i < this._users.length; i++){
            if(this._users[i] == user){
                break;
            }
        }
        return this._imgs[i];
    };


}

// Oekaki_list.prototype.add_user_img = function(user,img){
//     this._users.unshift(user);
//     this._imgs.unshift(img);
//     return;
// }

// Oekaki_list.prototype.recent_user_img = function(user){
//     for(var i=0; i < this._users.length; i++){
//         if(this._users[i] == user){
//             break;
//         }
//     }
//     return this._imgs[i];
// }



var paint_room = socket.of('/room').on('connection',function(client){

    Room.find({},function(err,roomdata){
        client.emit('connected',{

            roomdata: roomdata,

            // rooms: rooms,
            // creaters: creaters,
            // counts: counts,
        });
    });

    client.on('createroom',function(data){

        var newRoom = new Room();
        newRoom.room_name = data.room;
        newRoom.count = 1;
        newRoom.creater = data.name;
        newRoom.mode = 0;

        // newRoom.imglist[0].add_user_img("aa","bb");
        // console.log("test:::::",newRoom.imglist[0]);

        newRoom.save(function(err) {
            if (err) { console.log(err); }
            else{
                Room.find({},function(err,roomdata){
                    client.broadcast.emit('createroom',{

                        roomdata: roomdata,

                        // rooms: rooms,
                        // creaters: creaters,
                        // counts: counts,
                    });
                });

                console.log("newRoom:",newRoom);

                Room.find({},function(err,roomdata){
                    console.log("Room:",roomdata);
                });

            }
        });

        // rooms.unshift(data.room);
        // creaters.unshift(data.name);
        // counts.unshift(1);

        //test
        // Room.find({},function(err,roomdata){
        //     client.broadcast.emit('createroom',{

        //         roomdata: roomdata,

        //         rooms: rooms,
        //         creaters: creaters,
        //         counts: counts,
        //     });
        // });
    });

    client.on('init',function(req){

        client.set('room',req.room);
        client.set('name',req.name);
        // paint_room.to(req.room).emit('chatmessage',{
        //     text: req.name + "さんが入室しました",
        // });

        client.join(req.room);
        // create_paint_set(req.room);
        paint_room.to(req.room).emit('firstconnect',{
            connect: true,
            user: req.name,
        });
        // console.log("initした時の部屋のユーザリスト:",room_users[req.room]);


    });

    client.on('disconnect',function(){
        var client_room = return_client_room(client);
        //var client_name = return_client_name(client);

        console.log(client.id + "が切断しました");
        if(client_room){
            // delete_user(room_users[client_room],client.user);
            // if(room_mode[client_room] == 2 || room_mode[client_room] == 3){
            //     delete_user(room_orderlist[client_room],client.user);
            // }


            // paint_room.to(client_room).json.emit('disconnect',{
            //     user: client.user,
            //     users: room_users[client_room],
            //     orderlist: room_orderlist[client_room],
            // });

            // if(client.user == room_hostname[client_room]){
            //     room_mode[client_room] = 0;
            //     room_hostname[client_room] = "";
            //     room_orderlist[client_room] =[];
            //     room_drawtime[client_room] = 0;
            //     room_nextuser[client_room] = "";

            //     paint_room.to(client_room).json.emit('newgame',{
            //         new: true,
            //     });
            // }


            //db使ってる
            Room.find({
                'room_name': decodeURI(client_room)
            },function(err,roomdata){

                console.log(roomdata[0]);
                console.log("hostname:",roomdata[0].hostname,",clientuser:",client.user);
                // // ホストが抜けたら初期化
                // if(roomdata[0].hostname == client.user){
                //     roomdata[0].mode = 0;
                //     roomdata[0].hostname = "";
                //     roomdata[0].orderlist =[];
                //     roomdata[0].drawtime = 0;
                //     roomdata[0].nextuser = "";
                // }

                var drawinguser = roomdata[0].nextuser;

                // 描いてる人が消えたら
                if(roomdata[0].mode == 2 && client.user == roomdata[0].nextuser){
                    for(var i = 0; i < roomdata[0].orderlist.length; i++){
                        if(roomdata[0].orderlist[i] == client.user){
                            var nextnum = i - 1;
                            roomdata[0].nextuser = roomdata[0].orderlist[nextnum];
                            drawinguser = roomdata[0].nextuser;
                            break;
                        }
                    }
                    console.log("描いてる人消えたら:",drawinguser);
                }

                var isFirstDeleted = false;
                console.log("client.user:",client.user);
                console.log("orderlist:",roomdata[0].orderlist[roomdata[0].orderlist.length-1]);
                if(client.user == roomdata[0].orderlist[roomdata[0].orderlist.length-1]){
                    isFirstDeleted = true;
                    console.log("最初のユーザ消えた");
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

                        // hostが抜けたらnewgame
                        // if(roomdata[0].hostname == ""){
                        //     paint_room.to(client_room).json.emit('newgame',{
                        //         new: true,
                        //     });
                        // }


                        // disconnect情報を渡す
                        console.log("disconnectのとこ:",roomdata);
                        paint_room.to(client_room).json.emit('disconnect',{
                            user: client.user,
                            users: roomdata[0].users,
                            orderlist: roomdata[0].orderlist,
                            hostname: roomdata[0].hostname,
                        });

                        // 描いてる人が消えたら
                        if(drawinguser != client.user){
                            console.log("isFirstDeleted:",isFirstDeleted);
                            paint_room.to(client_room).emit('drawfin',{
                                nextuser: roomdata[0].nextuser,
                                imglist_user: roomdata[0].imglist_user,
                                imglist_img: roomdata[0].imglist_img,
                                isFirstDeleted: isFirstDeleted
                            });
                        }

                        // カウント渡す
                        if(roomdata[0].count == 0){
                            Room.remove({
                                'room_name': decodeURI(client_room)
                            },function(err,roomdata){});
                        }else{
                            console.log("emit room_countきてる");
                            client.broadcast.emit('room_count',{
                                count: roomdata[0].count,
                                room: client_room,
                            });

                        }


                    }
                });
                isNewGame = false;



            });
        }

        var count = 0;
        for(var i in paint_room.clients(client_room)){
            //console.log(paint_room.clients(client_room)[i].id + "disconnected:"+ paint_room.clients(client_room)[i].disconnected);
            count++;
            }

        // roomを消す
        if(count == 1){
            // for(var i=0; i < rooms.length; i++){

            //     if(encodeURI(rooms[i]) == client_room){
            //         rooms.splice(i,1);
            //         creaters.splice(i,1);
            //         counts.splice(i,1);
            //     }
            // }


            Room.remove({
                'room_name': decodeURI(client_room)
            },function(err,roomdata){

            });


            Room.find({},function(err,roomdata){
                client.broadcast.json.emit('createroom',{

                    roomdata: roomdata,

                    // rooms: rooms,
                    // creaters: creaters,
                    // counts: counts,
                });
            });
            client.leave(client_room);

        }

        //paint_room.to(room).emit('chatmessage', name + " さんが退出");

        // room_count[client_room]--;
        // client.broadcast.emit('room_count',{
        //     count: room_count[client_room],
        //     room: client_room,
        // });


        // countを渡す
        // for(var i=0; i < rooms.length; i++){
        //     if(encodeURI(rooms[i]) == client_room){
        //         counts[i] = room_users[client_room].length;
        //         if(counts[i] == 0){
        //             rooms.splice(i,1);
        //             creaters.splice(i,1);
        //             counts.splice(i,1);
        //         }else{
        //             client.broadcast.emit('room_count',{
        //                 count: counts[i],
        //                 room: client_room,
        //             });
        //         }
        //     }
        // }





    });




    client.on('login',function(data){
        var client_room = return_client_room(client);
        // var client_name = return_client_name(client);
        // room_users[client_room].unshift(data.user);
        // if(room_mode[client_room] == 2 || room_mode[client_room] == 3){
        //     room_orderlist[client_room].unshift(data.user);
        // }
        client.user = data.user;
        // paint_room.to(client_room).emit('login',{
        //     users: room_users[client_room],
        //     orderlist: room_orderlist[client_room],
        //     mode: room_mode[client_room],
        //     hostname: room_hostname[client_room],
        //     nextuser: room_nextuser[client_room],
        //     drawtime: room_drawtime[client_room],
        // });

        // countを渡す
        // for(var i=0; i < rooms.length; i++){
        //     if(encodeURI(rooms[i]) == client_room){
        //         counts[i] = room_users[client_room].length;
        //         client.broadcast.emit('room_count',{
        //             count: counts[i],
        //             room: client_room,
        //         });
        //     }
        // }


        Room.find({},function(err,roomdata){
            console.log("ログインしたとき、dbの中身",roomdata);
        });

        Room.find({
            'room_name': decodeURI(client_room)
        },function(err,roomdata){
            if(roomdata[0].mode == 2 || roomdata[0].mode == 3){
                roomdata[0].orderlist.unshift(data.user);
            }

            console.log("誰かがログインしてきたとき、db使ってのusers、追加する前:",roomdata[0].users);
            roomdata[0].users.unshift(data.user);
            roomdata[0].hostname = roomdata[0].users[roomdata[0].users.length-1];
            roomdata[0].save(function(err) {
                if (err) { console.log(err); }
                else{
                    console.log(roomdata[0]);
                    paint_room.to(client_room).emit('login',{
                        users: roomdata[0].users,
                        orderlist: roomdata[0].orderlist,
                        mode: roomdata[0].mode,
                        hostname: roomdata[0].hostname,
                        nextuser: roomdata[0].nextuser,
                        drawtime: roomdata[0].drawtime,
                    });
                }
            });
            roomdata[0].count = roomdata[0].users.length;

            client.broadcast.emit('room_count',{
                count: roomdata[0].count,
                room: client_room,
            });
        });


        // デバッグ
        console.log("login情報をemitしたユーザ:",data.user);
        // console.log("部屋のユーザリスト:",room_users[client_room]);


    });

    client.on('order',function(data){
        var client_room = return_client_room(client);
        // room_mode[client_room] = 2;
        // room_orderlist[client_room] = data.list.concat();
        // room_drawtime[client_room] = data.drawtime;
        // paint_room.to(client_room).emit('order',{
        //     list: data.list,
        //     drawtime: data.drawtime,
        // });

        Room.find({
            'room_name': decodeURI(client_room)
        },function(err,roomdata){
            roomdata[0].mode = 2;
            roomdata[0].orderlist = data.list.concat();
            roomdata[0].drawtime = data.drawtime;
            roomdata[0].nextuser = client.user;
            roomdata[0].save(function(err) {
                if (err) { console.log(err); }
                else{
                    paint_room.to(client_room).emit('order',{
                        list: data.list,
                        drawtime: data.drawtime,
                    });
                }
            });

        });


        // paint_room.to(client_room).broadcast.emit('order',{
        //     list: data.list,
        //     drawtime: room_drawtime[client_room],
        // });
    });

    client.on('drawfin',function(data){
        var client_room = return_client_room(client);
        // room_mode[client_room] = 2;
        // room_orderlist[client_room] = data.list.concat();
        // room_imglist[client_room] = data.imglist.concat();
        // for(var i = 0; i < room_orderlist[client_room].length; i++){
        //     if(room_orderlist[client_room][i] == data.finuser){
        //         var nextnum = i - 1;
        //         room_nextuser[client_room] = room_orderlist[client_room][nextnum];
        //         paint_room.to(client_room).emit('drawfin',{
        //             nextuser: room_nextuser[client_room],
        //             beforeimg: room_imglist[client_room],
        //         });
        //         // paint_room.to(client_room).broadcast.emit('drawfin',{
        //         //     nextuser: room_nextuser[client_room],
        //         //     beforeimg: room_imglist[client_room],
        //         // });
        //         break;
        //     }
        // }
        // if(nextnum == -1 ){
        //     room_mode[client_room] = 3;
        //     paint_room.to(client_room).emit('gamefin',{
        //         fin: true,
        //     });
        //     // paint_room.to(client_room).broadcast.emit('gamefin',{
        //     //     fin: true,
        //     // });
        // }

        Room.find({
            'room_name': decodeURI(client_room)
        },function(err,roomdata){
            roomdata[0].mode = 2;
            roomdata[0].orderlist = data.list.concat();


            roomdata[0].imglist_user.unshift(data.finuser);
            roomdata[0].imglist_img.unshift(data.img);


            // roomdata[0].imglist.unshift(data.img);
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
                        imglist_user: roomdata[0].imglist_user,
                        imglist_img: roomdata[0].imglist_img,
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
        // room_mode[client_room] = 1;
        // room_hostname[client_room] = data.hostname;
        // paint_room.to(client_room).emit('host',{
        //     isClickHost: data.isClickHost,
        //     hostname: data.hostname,
        // });
        // paint_room.to(client_room).broadcast.emit('host',{
        //     isClickHost: data.isClickHost,
        //     hostname: data.hostname,
        // });

        Room.find({
            'room_name': decodeURI(client_room)
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
        // room_mode[client_room] = 0;
        // room_hostname[client_room] = "";
        // room_orderlist[client_room] =[];
        // room_drawtime[client_room] = 0;
        // room_nextuser[client_room] = "";

        // paint_room.to(client_room).emit('newgame',{
        //     new: true,
        // });
        // paint_room.to(client_room).broadcast.emit('newgame',{
        //     new: true,
        // });
        Room.find({
            'room_name': decodeURI(client_room)
        },function(err,roomdata){
            roomdata[0].mode = 0;
            roomdata[0].hostname = "";
            roomdata[0].orderlist =[];
            roomdata[0].drawtime = 0;
            roomdata[0].nextuser = "";

            roomdata[0].save(function(err) {
                if (err) { console.log(err); }
                else{
                    paint_room.to(client_room).emit('newgame',{
                        new: true,
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
        // paint_room.to(client_room).broadcast.emit('comment',{
        //     comment: data.comment,
        //     user: data.user,
        // });

    });







    function delete_user(list,user){
        for(var i = 0; i < list.length; i++){
            if(list[i] == user){
                list.splice(i,1);
            }
        }
    }






});
