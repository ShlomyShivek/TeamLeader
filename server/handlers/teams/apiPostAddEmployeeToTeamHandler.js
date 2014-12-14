//the url path to be used for this handler
exports.path='/teams/:teamName';

//the http verb to be used for this handler
exports.verb='POST';


exports.handleRequest=function(req, res){

    console.log('handling ' + JSON.stringify(req.route.methods) + ' ' + req.originalUrl + ' from:' + req.header('referer'));

    var errorCodes = require('../../models/errorCodes/ErrorCodes');

    var teamsService=require('../../services/teamsService');
    var authenticationService=require('../../services/authenticationService');

    var sessionToken = req.header('Authentication');
    var user=authenticationService.getUser(sessionToken);

    var requestTeamName = req.params.teamName;
    var employeeName = req.body.name;
    console.log('adding new employee '+employeeName+' to team '+requestTeamName);

    teamsService.addEmployeeToTeam(user,employeeName,requestTeamName, function(data){
        //success
        res.json({ message: 'new team member was added' });
    }, function(data){
        //failure
        console.log('failed to add new team member');
        if(data==errorCodes.ServicesErrorCodes.ItemAlreadyExists){
            res.status(400).json({err:errorCodes.ApiErrorCodes.TeamMemberAlreadyExists,message:'employee is already a member of this team'});
        }else{
            res.status(400).json({err:errorCodes.ApiErrorCodes.UnknownError, message:'unknown error occurred.'});
        }
    });
}