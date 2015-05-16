//the url path to be used for this handler
exports.path='/teams';

//the http verb to be used for this handler
exports.verb='POST';


exports.handleRequest=function(req, res){

    console.log('handling ' + JSON.stringify(req.route.methods) + ' ' + req.originalUrl + ' from:' + req.header('referer'));
    var errorCodes = require('../../models/errorCodes/ErrorCodes');

    var teamsService=require('../../services/teamsService');
    var authenticationService=require('../../services/authenticationService');

    var sessionToken = req.header('Authentication');
    var user=authenticationService.getUser(sessionToken);

    var teamModel = require('../../dbModelsInitiator').getDbModel('team');
    var team=new teamModel(req.body);

    console.log(team);

    teamsService.addTeam(user, team,function(data){
        //Success
        res.status(200).json({ message: 'new team added' });
    }, function(data){
        //failure
        console.log('failed to create new team');
        if(data==errorCodes.ServicesErrorCodes.MissingData){
            res.status(400).json({err:errorCodes.ApiErrorCodes.MissingData,message:'team name missing'});
        } else if (data==errorCodes.ServicesErrorCodes.ItemAlreadyExists){
            res.status(400).json({err:errorCodes.ApiErrorCodes.TeamAlreadyExists, message:'team name already exists'});
        }else{
            res.status(400).json({err:errorCodes.ApiErrorCodes.UnknownError, message:'unknown error occurred.'});
        }
    });
}