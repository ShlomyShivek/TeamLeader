/*
This file describes the models that are exposed by the api

 */

//employee model
exports.Employee = function(name,defaultWorkTime,id){
    this.id=id;
    this.name=name;
    this.defaultWorkTime=defaultWorkTime;
}

//team Member
exports.TeamMember = function(employee){
    this.Employee=employee;
}


exports.Team = function(teamName){
    this.Name = teamName;
    this.Members = new Array();
    this.Leader=null;
}


exports.Project = function(projectName){
    this.Name = projectName;
    this.Starts = null;
    this.Ends = null;
    this.WorkingDays = null;
    this.Tasks = new Array();
}