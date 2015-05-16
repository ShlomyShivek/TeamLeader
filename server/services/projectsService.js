var projectsModel = require('../dbModelsInitiator').getDbModel('project');

exports.getProjects=function(user, callback){
    //var projectsModel = require('../dbModelsInitiator').getDbModel('project');
    var result=new Array();

    projectsModel.find(function (err, projects) {
        if (err) return console.error(err);

        projects.forEach(function(projectEntry){
            var project=new projectsModel(projectEntry);
            result.push(project);
        });

        callback(result);
    })

}

exports.addProject= function (project, user, onSuccess, onFailure) {
    if((project==null)||(project.name==null)||(project.name.trim()=='')){
        onFailure(100); //missing project name
    }
    project.save(function (err, model) {
        if (err) {
            onFailure();
        }
        else{
            console.log('New data entered to DB:' + project.toString());
            onSuccess();
        }

    });
}

exports.deleteProject = function(projectName, user, onSuccess, onFailure) {

    var project = new projectsModel({projectName: projectName});
    projectsModel.remove({name: projectName}, function (err) {
        if (!err) {
            console.log('success delete');
  //          message.type = 'notification!';
            onSuccess();
        }
        else {
//            message.type = 'error';
            onFailure();
        }
    });
    console.log(projectName);
}


