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

exports.addProject= function (project, user) {
    project.save(function (err, model) {
        if (err) return console.error(err);
        console.log('New data entered to DB:' + project.toString());
    });
}

exports.deleteProject = function(projectName, user, onSuccess, onFailure) {

    var project = new projectsModel({projectName: projectName});
    projectsModel.remove({projectName: projectName}, function (err) {
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


