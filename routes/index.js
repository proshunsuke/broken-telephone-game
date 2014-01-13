
/*
 * GET home page.
 */

var model = require('../model');
var Room = model.Room;

exports.index = function(req, res){
        res.render('index', { title: 'お絵かき伝言ゲーム',
                              pagename: 'index'});
};

exports.create = function(req, res){
    var result = { title: 'お絵かき伝言ゲーム',
                   username: req.body.username,
                   pagename: 'create'};
    res.render('create',result);
};

exports.enter = function(req, res){
    var result = { title: 'お絵かき伝言ゲーム',
                   username: req.body.username,
                   pagename: 'enter'};
    res.render('enter',result);
};

exports.room = function(req, res){
    var result = { title: 'お絵かき伝言ゲーム',
                   username: req.body.username,
                   pagename: 'room'};
    console.log("room,req.body:",req.body);
    Room.find({
        'roomname': req.body.roomname
    },function(err,roomdata){
        console.log("roomdata:",roomdata[0]);
        if(req.body.password){
            roomdata[0].password = req.body.password;

            roomdata[0].save(function(err){
                if(err){}
                else{
                    res.render('room',result);
                }
            });
        }else{
            res.render('room',result);
        }
    });
};

exports.about = function(req, res){
    res.render('about', { title: 'お絵かき伝言ゲーム',
                          pagename: 'about'});
};

exports.contact = function(req, res){
    res.render('contact', { title: 'お絵かき伝言ゲーム',
                            pagename: 'contact'});
};