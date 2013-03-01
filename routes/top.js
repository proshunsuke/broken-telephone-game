
/*
 * GET home page.
 */

exports.top = function(req, res){
    var result = { title: 'お絵かき伝言ゲーム',
                   username: req.body.username,
                   pagename: 'top'};
    res.render('top',result);
};