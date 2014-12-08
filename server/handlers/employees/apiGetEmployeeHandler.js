//the url path to be used for this handler
exports.path='/employees/:searchPattern';

//the http verb to be used for this handler
exports.verb='GET';


exports.handleRequest=function(req, res){

    console.log('handling ' + JSON.stringify(req.route.methods) + ' ' + req.originalUrl + ' from:' + req.header('referer'));

    var teamsService=require('../../services/teamsService');
    var authenticationService=require('../../services/authenticationService');
    require('../../models/errorCodes/ErrorCodes');

    var sessionToken = req.header('Authentication');
    var user=authenticationService.getUser(sessionToken);

    teamsService.searchEmployees(user, req.params.searchPattern, function(data){
        //Success
        res.json({searchResult:data});
    }, function(data){
        //Failure
        console.log('failed searching for employees:'+data);
        res.status(400).json({err:ApiErrorCodes.UnknownError, message:'unknown error occurred.'});
    });
}