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
    teamsService.getMembersOfTeam(user,requestTeamName,function(employees){
        //Success

        var team=new apiModels.Team(requestTeamName);


        var members=new Array();
        employees.forEach(function (dbEmployee) {
            var serviceTeamMember=new apiModels.TeamMember(dbEmployee.role);
            serviceTeamMember.name=dbEmployee.name;
            serviceTeamMember.defaultWorkTime=dbEmployee.defaultWorkTime;
            members.push(serviceTeamMember);
            if(dbEmployee.role==apiModels.TeamMemberRole.TeamLeader){
                team.setLeader(serviceTeamMember);
            }
        });
        team.Members=members;
        console.log('returning team members:' + members);
        res.json(team);
    }, function (data) {
        //Failure
        console.log('failed to get members of team');
        res.status(400).json({err:errorCodes.ApiErrorCodes.UnknownError, msg:'unknown error occurred.'});
    });
/*
    res.json({leaderId:'23RASFASDFAS', members:[
        {id:'23RASFASDFAS',name:'LeaderFirst LeaderLast'},
        {id:'dwfksj3434dnfkb',name:'MemberFirst1 MemberLast1'},
        {id:'dwfhwtwsgbksjdnfkb',name:'MemberFirst2 MemberLast2'}
    ]});
*/
/*
    var sessionToken = req.header('Authentication');
    var user=authenticationService.getUser(sessionToken);

    teamsService.getProjects(user,function(projectsForUser){
        res.json(projectsForUser);
    });
*/
}