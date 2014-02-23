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
app.get('/gallery', routes.gallery);

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

var socket = require('socket.io').listen(server);

require('./routes/syncRoom');
syncRoom.init();
require('./routes/syncGallery');
syncGallery.init();

// roomにアクセスした時に呼び出される
var paintRoom = socket.of('/room').on('connection', function(client){
    syncRoom.syncOnInit(client, paintRoom);
});

// galleryにアクセスした時に呼び出される
var galleryRoom = socket.of('/gallery').on('connection', function(client){
    syncGallery.syncOnInit(client, galleryRoom);
});
