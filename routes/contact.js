
/*
 * GET contact page.
 */

exports.contact = function(req, res){
    res.render('contact', { title: 'お絵かき伝言ゲーム',
                            pagename: 'contact'});
};