
/*
 * GET home page.
 */

exports.paint2 = function(req, res){
    var result = { title: 'お絵かき伝言ゲーム',
                   username: req.body.username,
                   pagename: 'paint2'};
    res.render('paint2',result);
};