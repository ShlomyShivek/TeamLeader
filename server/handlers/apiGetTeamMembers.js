//the url path to be used for this handler
exports.path='/teams/:teamName';

//the http verb to be used for this handler
exports.verb='GET';


var projectsService=require('../services/projectsService');
var authenticationService=require('../services/authenticationService');

exports.handleRequest=function(req, res){

    var requestTeamName = req.params.teamName;

    res.json({leaderId:'23RASFASDFAS', members:[
        {id:'23RASFASDFAS',name:'LeaderFirst LeaderLast'},
        {id:'dwfksj3434dnfkb',name:'MemberFirst1 MemberLast1'},
        {id:'dwfhwtwsgbksjdnfkb',name:'MemberFirst2 MemberLast2'}
    ]});
/*
    var sessionToken = req.header('Authentication');
    var user=authenticationService.getUser(sessionToken);

    projectsService.getProjects(user,function(projectsForUser){
        res.json(projectsForUser);
    });
*/
}