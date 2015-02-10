/*
Update team leader
 */

//the url path to be used for this handler
exports.path='/teams/:teamName/:memberName';

//the http verb to be used for this handler
exports.verb='PUT';


exports.handleRequest=function(req, res){

    console.log('handling ' + JSON.stringify(req.route.methods) + ' ' + req.originalUrl + ' from:' + req.header('referer'));

    var errorCodes = require('../../models/errorCodes/ErrorCodes');

    var teamsService=require('../../services/teamsService');
    var authenticationService=require('../../services/authenticationService');

    var sessionToken = req.header('Authentication');
    var user=authenticationService.getUser(sessionToken);

    var teamName=req.params.teamName;
    var memberName=req.params.memberName;

    console.log('updating team leader in team. team name:'+teamName+' member name:'+memberName);

    teamsService.assignTeamLeader(user,teamName,memberName, function(data){
        //Success
        res.status(200).end();
    },function(data){
        //Failure
        console.log('failed to set team leader');

        if(data==errorCodes.ServicesErrorCodes.MissingData){
            res.status(400).json({err:errorCodes.ApiErrorCodes.MissingData,message:'team name or member name missing'});
        }else{
            res.status(400).json({err:errorCodes.ApiErrorCodes.UnknownError, message:'unknown error occurred.'});
        }

    })
}