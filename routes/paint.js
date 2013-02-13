
/*
 * GET home page.
 */

exports.paint = function(req, res){
    var result = { title: 'お絵かき伝言ゲーム',
                   username: req.body.username,
                   pagename: 'paint'};
    res.render('paint',result);
};