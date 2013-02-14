
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , routesD = require('./routes/draw')
  , routesP = require('./routes/paint')
  , routesE = require('./routes/enter')
  , routesA = require('./routes/about')
  , routesC = require('./routes/contact')
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
app.get('/about', routesA.about);
app.get('/contact', routesC.contact);

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

socket.on('connection',function(client){
    // var client_id = client.id;
    // console.log(client_id);

    // client.json.emit('connect',{
    //     client_id: client_id
    // });
    // client.broadcast.json.emit('connect',{
    //     client_id: client_id
    // });

    // client.on('connect',function(data){
    //     client.json.emit('connect',{
    //         client_id: data.client_id
    //     });
    //     client.broadcast.json.emit('connect',{
    //         client_id: data.client_id
    //     });
    //     console.log(data.client_id);
    // });

    client.on('login',function(data){
        console.log("users:",users);
        users.unshift(data.user);
        if(mode == 2){
            orderlist.unshift(data.user);
        }
        client.user = data.user;
        client.json.emit('login',{
            users: users,
            orderlist: orderlist,
            mode: mode,
            hostname: hostname,
            nextuser: nextuser,
            drawtime: drawtime,
        });
        client.broadcast.json.emit('login',{
            users: users,
            orderlist: orderlist,
        });
    });

    client.on('disconnect',function(){
        console.log(client.id + "が切断しました");
        console.log("切断したユーザ:"+client.user);

        for(var i = 0; i < users.length; i++){
            if(users[i] == client.user){
                users.splice(i,1);
            }
        }
        client.broadcast.json.emit('disconnect',{
            user: client.user,
        });

        if(client.user == hostname){
            mode = 0;
            hostname = "";
            orderlist =[];
            drawtime = 0;
            nextuser = "";

            client.broadcast.json.emit('newgame',{
                new: true,
            });
        }
    });

    client.on('message',function(event){
        client.json.emit('message',{
            act: event.act,
            x: event.x,
            y: event.y,
            color: event.color,
            size: event.size
        });
        client.broadcast.json.emit('message',{
            act: event.act,
            x: event.x,
            y: event.y,
            color: event.color,
            size: event.size
        });
    });

    client.on('order',function(data){
        mode = 2;
        orderlist = data.list.concat();
        drawtime = data.drawtime;
        client.json.emit('order',{
            list: data.list,
            drawtime: data.drawtime,
        });
        client.broadcast.json.emit('order',{
            list: data.list,
            drawtime: drawtime,
        });
    });

    var imglist;
    client.on('drawfin',function(data){
        mode = 2;
        orderlist = data.list.concat();
        imglist = data.imglist.concat();
        console.log(orderlist);
        for(var i = 0; i < orderlist.length; i++){
            if(orderlist[i] == data.finuser){
                var nextnum = i - 1;
                nextuser = orderlist[nextnum];
                client.json.emit('drawfin',{
                    nextuser: nextuser,
                    beforeimg: imglist,
                });
                client.broadcast.json.emit('drawfin',{
                    nextuser: nextuser,
                    beforeimg: imglist,
                });
                break;
            }
        }
        if(nextnum == -1 ){
            mode = 3;
            client.json.emit('gamefin',{
                fin: true,
            });
            client.broadcast.json.emit('gamefin',{
                fin: true,
            });
        }
    });

    client.on('host',function(data){
        mode = 1;
        hostname = data.hostname;
        client.json.emit('host',{
            isClickHost: data.isClickHost,
            hostname: data.hostname,
        });
        client.broadcast.json.emit('host',{
            isClickHost: data.isClickHost,
            hostname: data.hostname,
        });
    });

    client.on('newgame',function(data){
        mode = 0;
        hostname = "";
        orderlist =[];
        drawtime = 0;
        nextuser = "";

        client.json.emit('newgame',{
            new: true,
        });
        client.broadcast.json.emit('newgame',{
            new: true,
        });
    });
});
