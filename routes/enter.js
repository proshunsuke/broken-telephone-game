exports.enter = function(req, res){
    var result = { title: 'お絵かき伝言ゲーム',
                   username: req.body.username};
    console.log(result);
    res.render('draw',result);
};