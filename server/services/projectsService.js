exports.getProjects=function(user, callback){
    var result=new Array();
    var projectsModel = require('../dbModelsInitiator').getDbModel('project');


    projectsModel.find(function (err, projects) {
        if (err) return console.error(err);
        projects.forEach(function(projectEntry){
            var project=new projectsModel(projectEntry);
            result.push(project);
            console.log(result);
        })
        callback(result);
    })

}

exports.addProject= function (project, user) {
    project.save(function (err, model) {
        if (err) return console.error(err);
        console.log('New data entered to DB:' + project.toString());
    });
}
