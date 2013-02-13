
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', { title: 'お絵かき伝言ゲーム',
                          pagename: 'index'});
};