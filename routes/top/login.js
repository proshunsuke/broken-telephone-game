
/*
 * GET home page.
 */

exports.login = function(req, res){
    var result = { title: 'お絵かき伝言ゲーム',
                   username: req.body.username,
                   pagename: 'login'};
    res.render('top/login',result);
};