/*
 * GET home page.
 */

exports.enter = function(req, res){
    var result = { title: 'お絵かき伝言ゲーム',
                   username: req.body.username,
                   pagename: 'enter'};
    res.render('enter',result);
};