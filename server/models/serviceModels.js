/*
This file describes the models that are exposed by the api

 */

//employee model
exports.Employee = function(name,defaultWorkTime){
    this.name=name;
    this.defaultWorkTime=defaultWorkTime;
}

//team Member
exports.TeamMember = function(role, employee){
    this.Role=role;
    this.Employee=employee;
}


//define the different roles for a teamMember
exports.TeamMemberRole = function(){
    TeamMemberRole.TeamLeader = 1;
    TeamMemberRole.TeamMember = 2;
}


exports.Team = function(teamName){
    this.Name = teamName;
    this.Members = new Array();
    this.Leader = null;

    this.setLeader=function(teamMember){
        this.Leader=teamMember;
    }
}
