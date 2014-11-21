//the url path to be used for this handler
exports.path='/projects';

//the http verb to be used for this handler
exports.verb='POST';


exports.handleRequest=function(req, res){

    var projectsService=require('../services/projectsService');
    var authenticationService=require('../services/authenticationService');

    var sessionToken = req.header('Authentication');
    var user=authenticationService.getUser(sessionToken);

    var projectsModel = require('../dbModelsInitiator').getDbModel('project');
    var project=new projectsModel(req.body);

    projectsService.addProject(project,user);

    console.log(req.body);

    res.json({ message: 'new project added' });
}