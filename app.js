/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , routesD = require('./routes/draw')
  , routesP = require('./routes/paint')
  , routesP2 = require('./routes/paint2')
  , routesE = require('./routes/enter')
  , routesA = require('./routes/about')
  , routesC = require('./routes/contact')
  , routesCR = require('./routes/create')
  , routesEN = require('./routes/enter')
  , routesR = require('./routes/room')
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
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.post('/draw', routesD.draw);
app.post('/enter',routesE.enter);
app.post('/paint', routesP.paint);
app.post('/paint2', routesP2.paint2);
app.get('/about', routesA.about);
app.get('/contact', routesC.contact);
app.get('/create',routesCR.create);
app.get('/enter',routesEN.enter);
app.post('/room',routesR.room);
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

var users = [];
var orderlist = [];
var mode = 0;
var drawtime = 0;
var hostname = "";
var nextuser = "";

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


var roomstest = new Array();
// ここからテスト
var chat = socket.of('/top').on('connection',function(client){

    client.emit('connected',{
        rooms: roomstest,
    });

    client.on('disconnect',function(){
        var room, name;

        client.get('room', function(err, _room) {
            room = _room;
        });
        client.get('name', function(err, _name) {
            name = _name;
        });
        var count = 0;
        for(var i in chat.clients(room)){
            console.log(chat.clients(room)[i].id + "disconnected:"+ chat.clients(room)[i].disconnected);
            count++;
        }

        if(count == 1){
            for(var i=0; i < roomstest.length; i++){
                console.log("rooms",roomstest[i]);
                console.log("room",room);

                if(encodeURI(roomstest[i]) == room){
                    roomstest.splice(i,1);
                }
            }
            client.broadcast.json.emit('createroom',{
                rooms: roomstest,
            });
        }
        client.broadcast.json.emit('createroom',{
                rooms: roomstest,
            });

        client.leave(room);
        chat.to(room).emit('chatmessage', name + " さんが退出");

        console.log("全ルームのハッシュ:",chat.manager.roomstest);
    });

    client.on('init',function(req){
        console.log("initきてる");
        console.log("room:",req.room);
        console.log("name:",req.name);

        client.set('room',req.room);
        client.set('name',req.name);
        chat.to(req.room).emit('chatmessage',{
            text: req.name + "さんが入室しました",
        });

        client.join(req.room);
    });

    client.on('createroom',function(data){
        roomstest.unshift(data.room);
        console.log("rooms:",roomstest);
        client.broadcast.json.emit('createroom',{
            rooms: roomstest,
        });
    });

    client.on('chatmessage',function(req){
        var room, name;

        client.get('room',function(err,_room){
            room = _room;
        });
        client.get('name',function(err,_name){
            name = _name;
        });
        console.log("room:",room);
        console.log("name:",name);

        chat.to(room).emit('chatmessage',{
            text: name+":"+req.text,
        });
    });

});

var rooms = new Array();
var creaters = new Array();
var counts = new Array();


var room_users = [];
var room_orderlist = [];
var room_mode = [];
var room_drawtime = [];
var room_hostname = [];
var room_nextuser = [];
var room_imglist = [];
var room_count = [];


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
var create_paint_set = function(room){
    room_users[room] = new Array();
    room_orderlist[room] = new Array();
    room_mode[room] = 0;
    room_drawtime[room] = 0;
    room_hostname[room] = "";
    room_nextuser[room] = "";
    room_imglist[room] = [];
    room_count[room] = 0;


    // room_users[room][0] = "test0";
    // room_users[room][1] = "test1"
    // for(var i in room_users){
    //     console.log(i,":",room_users[i]);
    // }
    // for(var j=0; j < room_users[room].length; j++){
    //     console.log(j,":",room_users[room][j]);
    // }
}


var paint_room = socket.of('/room').on('connection',function(client){

    client.emit('connected',{
        rooms: rooms,
        creaters: creaters,
        counts: counts,
    });

    client.on('createroom',function(data){
        rooms.unshift(data.room);
        creaters.unshift(data.name);
        counts.unshift(1);

        client.broadcast.emit('createroom',{
            rooms: rooms,
            creaters: creaters,
            counts: counts,
        });
    });

    client.on('init',function(req){

        client.set('room',req.room);
        client.set('name',req.name);
        // paint_room.to(req.room).emit('chatmessage',{
        //     text: req.name + "さんが入室しました",
        // });

        client.join(req.room);
        create_paint_set(req.room);
        paint_room.to(req.room).emit('firstconnect',{
            connect: true,
        });


    });

    client.on('disconnect',function(){
        var client_room = return_client_room(client);
        //var client_name = return_client_name(client);

        console.log(client.id + "が切断しました");
        if(client_room){
            delete_user(room_users[client_room],client.user);
            if(room_mode[client_room] == 2 || room_mode[client_room] == 3){
                delete_user(room_orderlist[client_room],client.user);
            }


            paint_room.to(client_room).json.emit('disconnect',{
                user: client.user,
                users: room_users[client_room],
                orderlist: room_orderlist[client_room],
            });

            if(client.user == room_hostname[client_room]){
                room_mode[client_room] = 0;
                room_hostname[client_room] = "";
                room_orderlist[client_room] =[];
                room_drawtime[client_room] = 0;
                room_nextuser[client_room] = "";

                paint_room.to(client_room).json.emit('newgame',{
                    new: true,
                });
            }

        }

        var count = 0;
        console.log(paint_room.clients(client_room));
        for(var i in paint_room.clients(client_room)){
            console.log(paint_room.clients(client_room)[i].id + "disconnected:"+ paint_room.clients(client_room)[i].disconnected);
            count++;
        }

        // roomを消す
        if(count == 1){
            for(var i=0; i < rooms.length; i++){

                if(encodeURI(rooms[i]) == client_room){
                    rooms.splice(i,1);
                    creaters.splice(i,1);
                    counts.splice(i,1);
                }
            }
            // for(var i in rooms){
            //     if(encodeURI(rooms[i][0] == client_room)){
            //         delete rooms[i];
            //     }
            // }
            // client.broadcast.json.emit('createroom',{
            //     rooms: rooms,
            // });
        }

        client.broadcast.json.emit('createroom',{
            rooms: rooms,
            creaters: creaters,
            counts: counts,
        });
        client.leave(client_room);
        //paint_room.to(room).emit('chatmessage', name + " さんが退出");

        // room_count[client_room]--;
        // client.broadcast.emit('room_count',{
        //     count: room_count[client_room],
        //     room: client_room,
        // });


        // countを渡す
        for(var i=0; i < rooms.length; i++){
            if(encodeURI(rooms[i]) == client_room){
                counts[i] = room_users[client_room].length;
                if(counts[i] == 0){
                    rooms.splice(i,1);
                    creaters.splice(i,1);
                    counts.splice(i,1);
                }else{
                    client.broadcast.emit('room_count',{
                        count: counts[i],
                        room: client_room,
                    });
                }
            }
        }




    });




    client.on('login',function(data){
        var client_room = return_client_room(client);
        //var client_name = return_client_name(client);
        room_users[client_room].unshift(data.user);
        if(room_mode[client_room] == 2 || room_mode[client_room] == 3){
            room_orderlist[client_room].unshift(data.user);
        }
        client.user = data.user;
        paint_room.to(client_room).emit('login',{
            users: room_users[client_room],
            orderlist: room_orderlist[client_room],
            mode: room_mode[client_room],
            hostname: room_hostname[client_room],
            nextuser: room_nextuser[client_room],
            drawtime: room_drawtime[client_room],
        });
        // room_count[client_room]++;
        // client.broadcast.emit('room_count',{
        //     count: room_count[client_room],
        //     room: client_room,
        // });

        // countを渡す
        for(var i=0; i < rooms.length; i++){
            if(encodeURI(rooms[i]) == client_room){
                counts[i] = room_users[client_room].length;
                client.broadcast.emit('room_count',{
                    count: counts[i],
                    room: client_room,
                });
            }
        }


        // paint_room.to(client_room).emit('login',{
        //     users: room_users[client_room],
        //     orderlist: room_orderlist[client_room],
        // });
    });

    client.on('order',function(data){
        var client_room = return_client_room(client);
        room_mode[client_room] = 2;
        room_orderlist[client_room] = data.list.concat();
        room_drawtime[client_room] = data.drawtime;
        paint_room.to(client_room).emit('order',{
            list: data.list,
            drawtime: data.drawtime,
        });
        // paint_room.to(client_room).broadcast.emit('order',{
        //     list: data.list,
        //     drawtime: room_drawtime[client_room],
        // });
    });

    client.on('drawfin',function(data){
        var client_room = return_client_room(client);
        room_mode[client_room] = 2;
        room_orderlist[client_room] = data.list.concat();
        room_imglist[client_room] = data.imglist.concat();
        for(var i = 0; i < room_orderlist[client_room].length; i++){
            if(room_orderlist[client_room][i] == data.finuser){
                var nextnum = i - 1;
                room_nextuser[client_room] = room_orderlist[client_room][nextnum];
                paint_room.to(client_room).emit('drawfin',{
                    nextuser: room_nextuser[client_room],
                    beforeimg: room_imglist[client_room],
                });
                // paint_room.to(client_room).broadcast.emit('drawfin',{
                //     nextuser: room_nextuser[client_room],
                //     beforeimg: room_imglist[client_room],
                // });
                break;
            }
        }
        if(nextnum == -1 ){
            room_mode[client_room] = 3;
            paint_room.to(client_room).emit('gamefin',{
                fin: true,
            });
            // paint_room.to(client_room).broadcast.emit('gamefin',{
            //     fin: true,
            // });
        }
    });

    client.on('host',function(data){
        var client_room = return_client_room(client);
        room_mode[client_room] = 1;
        room_hostname[client_room] = data.hostname;
        paint_room.to(client_room).emit('host',{
            isClickHost: data.isClickHost,
            hostname: data.hostname,
        });
        // paint_room.to(client_room).broadcast.emit('host',{
        //     isClickHost: data.isClickHost,
        //     hostname: data.hostname,
        // });
    });

    client.on('newgame',function(data){
        var client_room = return_client_room(client);
        room_mode[client_room] = 0;
        room_hostname[client_room] = "";
        room_orderlist[client_room] =[];
        room_drawtime[client_room] = 0;
        room_nextuser[client_room] = "";

        paint_room.to(client_room).emit('newgame',{
            new: true,
        });
        // paint_room.to(client_room).broadcast.emit('newgame',{
        //     new: true,
        // });
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
