//the url path to be used for this handler
exports.path='/login';

//the http verb to be used for this handler
exports.verb='POST';

exports.handleRequest=function(req, res){

    console.log('handling ' + JSON.stringify(req.route.methods) + ' ' + req.originalUrl + ' from:' + req.header('referer'));


    console.log(req.body.username);
    res.json({ message: 'You just logged in....', token:'adfafadf' });
}