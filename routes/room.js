/*
 * GET home page.
 */

exports.room = function(req, res){
    var result = { title: 'お絵かき伝言ゲーム',
                   username: req.body.username,
                   pagename: 'room'};
    res.render('room',result);
};