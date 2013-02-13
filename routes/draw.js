
exports.draw = function(req, res){
    var result = { title: 'お絵かき伝言ゲーム',
                   username: req.body.username,
                   pagename: 'index'};
    console.log(result);
    res.render('draw',result);
};