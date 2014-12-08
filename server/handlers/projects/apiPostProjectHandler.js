//the url path to be used for this handler
exports.path='/projects';

//the http verb to be used for this handler
exports.verb='POST';


exports.handleRequest=function(req, res){

    console.log('handling ' + JSON.stringify(req.route.methods) + ' ' + req.originalUrl + ' from:' + req.header('referer'));

    var projectsService=require('../../services/projectsService');
    var authenticationService=require('../../services/authenticationService');

    var sessionToken = req.header('Authentication');
    var user=authenticationService.getUser(sessionToken);

    var projectsModel = require('../../dbModelsInitiator').getDbModel('project');
    var project=new projectsModel(req.body);

    projectsService.addProject(project,user,function(data){
        //Success
        res.json({ message: 'new project added' });
    }, function(data){
        //failure
        if(data==100){
            res.status(400).json({err:100,message:'project name missing'});
        }
    });
}