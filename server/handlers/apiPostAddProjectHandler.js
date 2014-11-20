//the url path to be used for this handler
exports.path='/projects';

//the http verb to be used for this handler
exports.verb='POST';

exports.handleRequest=function(req, res){
    console.log(req.body);
    res.json({ message: 'new project added' });
}