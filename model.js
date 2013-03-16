const MONGO_URL = process.env.MONGOHQ_URL;

var mongoose = require('mongoose');

// ローカル用
// var db = mongoose.connect('mongodb://localhost/brokenTerephoneGame');

// heroku用
var db = mongoose.connect(MONGO_URL);


var Room = new mongoose.Schema({
    room_name: {type: String},
    users: {type: Array},
    orderlist: {type: Array},
    mode: {type: Number},
    drawtime: {type: Number},
    hostname: {type: String},
    nextuser: {type: String},
    imglist_user: {type: Array},
    imglist_img: {type: Array},
    count: {type: Number},
    password: {type: String},
});

exports.Room = db.model('Room', Room);

