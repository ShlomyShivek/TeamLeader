//the url path to be used for this handler
exports.path='/projects';

//the http verb to be used for this handler
exports.verb='GET';


var projectsService=require('../services/projectsService');
var authenticationService=require('../services/authenticationService');

exports.handleRequest=function(req, res){

    var sessionToken = req.header('Authentication');
    var user=authenticationService.getUser(sessionToken);

    projectsService.getProjects(user,function(projectsForUser){
        res.json(projectsForUser);
    });

}