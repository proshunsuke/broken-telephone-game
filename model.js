const MONGO_URL = process.env.MONGOHQ_URL;

var mongoose = require('mongoose');

if(MONGO_URL){// heroku用
    var db = mongoose.connect(MONGO_URL);
}else{// ローカル用
    var db = mongoose.connect('mongodb://localhost/brokenTerephoneGame');
}

var imgListObj = new mongoose.Schema({
    img: {type: String}, // 1.png
    user: {type: String}, // プロ
    title: {type: String} // ドラえもん
});

var Room = new mongoose.Schema({
    roomName: {type: String}, // 部屋
    hostName: {type: String}, // プロ
    password: {type: String}, // 1111

    mode: {type: Number}, // 0 // 0:wait, 1:setting, 2:gaming, 3:finish
    drawTime: {type: Number}, // 5
    gameStartDate: {type: Date},
    drawStartDate: {type: Date},
    nextUser: {type: String}, // すずき

    users: {type: Array}, // {プロ, すずき, たなか, さとう}
    orderList: {type: Array}, // {すずき, プロ, さとう, たなか}

    imgList:[imgListObj] // [{1.png, プロ, ドラえもん}, {2.png, すずき, ドラえもん}, ...]
});

var imgListAllObj = new mongoose.Schema({
    img: {type: String}, // 1.png
    user: {type: String}, // プロ
    title: {type: String}, // ドラえもん
    year: {type: Number}, // 2014
    Month: {type: Number}, // 2
    Date: {type: Number} // 22
});

var Image = new mongoose.Schema({ // 今まで描いた絵のDB
    //imgListAll:[imgListAllObj] // [{1.png, プロ, ドラえもん, 2014, 2, 22},{2.png, すずき, ドラえもん, 2014, 2, 23}, ...]
    img: {type: String}, // 1.png
    user: {type: String}, // プロ
    title: {type: String}, // ドラえもん
    year: {type: Number}, // 2014
    month: {type: Number}, // 2
    date: {type: Number} // 22
});

Array.prototype.imgListUnshift = function (img, user, title){ // 配列にハッシュを入れてくれるやつ
    var imgListHash = {img: img, user: user, title: title};
    this.unshift(imgListHash);
}


exports.Room = db.model('Room', Room);
exports.Image = db.model('Image', Image);
