//the url path to be used for this handler
exports.path='/teams';

//the http verb to be used for this handler
exports.verb='GET';


var teamsService=require('../../services/teamsService');
var authenticationService=require('../../services/authenticationService');

exports.handleRequest=function(req, res){

    console.log('handling ' + JSON.stringify(req.route.methods) + ' ' + req.originalUrl + ' from:' + req.header('referer'));

    var sessionToken = req.header('Authentication');
    var user=authenticationService.getUser(sessionToken);

    teamsService.getTeams(user,function(teamsForUser){
        res.json(teamsForUser);
    }, function(data){
        //onFailure
        res.status(400).json({err:errorCodes.ApiErrorCodes.UnknownError, msg:'unknown error occurred.'});
    });

}