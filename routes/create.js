/*
 * GET home page.
 */

exports.create = function(req, res){
    var result = { title: 'お絵かき伝言ゲーム',
                   username: req.body.username,
                   pagename: 'create'};
    res.render('create',result);
};