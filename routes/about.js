
/*
 * GET about page.
 */

exports.about = function(req, res){
    res.render('about', { title: 'お絵かき伝言ゲーム',
                          pagename: 'about'});
};