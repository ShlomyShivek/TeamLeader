//the url path to be used for this handler
exports.path='/projects/:projectName';

//the http verb to be used for this handler
exports.verb='DELETE';


var projectsService=require('../../services/projectsService');
var authenticationService=require('../../services/authenticationService');

exports.handleRequest=function(req, res){

    console.log('handling ' + JSON.stringify(req.route.methods) + ' ' + req.originalUrl + ' from:' + req.header('referer'));

    var sessionToken = req.header('Authentication');
    var user=authenticationService.getUser(sessionToken);

    console.log('deleting project name=' + req.params.projectName);
    projectsService.deleteProject(req.params.projectName, user, function(){
        //onSuccess
        res.json({message:'OK'});
    }, function(){
        //onFailure
    });

}