//the url path to be used for this handler
exports.path='/teams/:teamName';

//the http verb to be used for this handler
exports.verb='GET';


var teamsService=require('../../services/teamsService');
var authenticationService=require('../../services/authenticationService');
var apiModels = require('../../models/serviceModels');

exports.handleRequest=function(req, res){

    console.log('handling ' + JSON.stringify(req.route.methods) + ' ' + req.originalUrl + ' from:' + req.header('referer'));

    var sessionToken = req.header('Authentication');
    var user=authenticationService.getUser(sessionToken);

    var requestTeamName = req.params.teamName;
    teamsService.getMembersOfTeam(user,requestTeamName,function(dbEmployees){
        //Success
        teamsService.getTeamByName(user,requestTeamName,function(dbTeam){
            //team found
            var team=new apiModels.Team(requestTeamName);

            dbEmployees.forEach(function (dbEmployee) {
                var employee=new apiModels.Employee(dbEmployee.name,dbEmployee.defaultWorkTime,dbEmployee.id);
                var serviceTeamMember=new apiModels.TeamMember(employee);
                team.Members.push(serviceTeamMember);
                //set the team leader in the result object
                if(dbTeam.leaderId==dbEmployee.id){
                    team.Leader=employee;
                }
            });

            console.log('finshed handling get team members. total of '+team.Members.length + ' found');
            res.json(team);
        }, function (data) {
            //failed to get team from db
            res.status(400).json({err:errorCodes.ApiErrorCodes.UnknownError, msg:'unknown error occurred.'});
        });

        }, function(data){
            //failed to get members of team
            res.status(400).json({err:errorCodes.ApiErrorCodes.UnknownError, msg:'unknown error occurred.'});
    });
}