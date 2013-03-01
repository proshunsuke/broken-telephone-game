
/*
 * GET home page.
 */

exports.room = function(req, res){
    var result = { title: 'お絵かき伝言ゲーム',
                   username: req.body.username,
                   roomname: req.body.roomname,
                   pagename: 'room'};
    res.render('top/room',result);
};