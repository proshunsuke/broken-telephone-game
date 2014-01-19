const MONGO_URL = process.env.MONGOHQ_URL;

var mongoose = require('mongoose');

// ローカル用
// var db = mongoose.connect('mongodb://localhost/brokenTerephoneGame');

// heroku用
var db = mongoose.connect(MONGO_URL);


var Room = new mongoose.Schema({
    roomname: {type: String},
    users: {type: Array},
    orderlist: {type: Array},
    mode: {type: Number},
    drawtime: {type: Number},
    gameStartDate: {type: Date},
    drawStartDate: {type: Date},
    hostname: {type: String},
    nextuser: {type: String},
    imgListUser: {type: Array},
    imgListImg: {type: Array},
    count: {type: Number},
    password: {type: String}
});

exports.Room = db.model('Room', Room);

