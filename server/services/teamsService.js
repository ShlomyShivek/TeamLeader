var teamModel = require('../dbModelsInitiator').getDbModel('team');
var employeeModel = require('../dbModelsInitiator').getDbModel('employee');
var errorCodes = require('../models/errorCodes/ErrorCodes');

//add new team for user
exports.addTeam=function(user, team, onSuccess, onFailure){
    if((team==null)||(team.name==null)||(team.name.trim()=='')){
        onFailure(errorCodes.ServicesErrorCodes.MissingData); //missing team name
    }
    console.log(team);

    team.save(function(err,model){
        if (err) {
            console.log(err);
            if(err.code==11000){
                onFailure(errorCodes.ServicesErrorCodes.DuplicateKey);
            }
            else{
                onFailure(errorCodes.ServicesErrorCodes.UnknownError);
            }
        }
        else{
            console.log('New data entered to DB:' + team.toString());
            onSuccess();
        }
    });
}

//get all teams for user
exports.getTeams=function(user, onSuccess, onFailure){
    teamModel.find(function (err, teams) {
        if (err) {
            onFailure(errorCodes.ServicesErrorCodes.UnknownError);
            return console.error(err);
        } else{
            var result=new Array();

            teams.forEach(function(teamEntry){
                var team=new teamModel(teamEntry);
                result.push(team);
            });
            onSuccess(result);
        }
    })
}

//create new employee
exports.addEmployee=function(user,employee,onSuccess, onFailure){
    if((employee==null)||(employee.name==null)||(employee.name.trim()=='')){
        onFailure(errorCodes.ServicesErrorCodes.MissingData); //missing employee name
    }
    else {
        employee.save(function (err, model) {
            if (err) {
                console.log(err);
                if (err.code == 11000) {
                    onFailure(errorCodes.ServicesErrorCodes.DuplicateKey);
                }
                else {
                    onFailure(errorCodes.ServicesErrorCodes.UnknownError);
                }
            }
            else {
                console.log('New employee entered to DB:' + employee.toString());
                onSuccess();
            }
        });
    }
}

//search for employees
exports.searchEmployees= function(user,searchPattern,onSuccess,onFailure){
    employeeModel.find(function(err,employees){
        if(err) {
            console.log('failed to search for employees in DB:' + err);
            onFailure(errorCodes.ServicesErrorCodes.UnknownError);
        }
        else {
            var result = new Array();
            employees.forEach(function (employeeEntry) {
                var employee = new employeeModel(employeeEntry);
                result.push(employee);
            });
            onSuccess(result);
        }
    })
}

//add employee to team
exports.addEmployeeToTeam=function(user,employee,team,onSuccess, onFailure){
    //get the employee details from the database
    employee.findOne(function (err, dbEmployee) {
        if(err){
            onFailure();
        }
        else{
            if(employee.teamIds.indexOf(team._id)!=-1){
                onFailure(errorCodes.ServicesErrorCodes.ItemAlreadyExists);
            }else{
                employee.teamIds.push(team._id);
                employee.update(function(err,model){
                    if(err){
                        onFailure(errorCodes.ServicesErrorCodes.UnknownError);
                    }
                    else{
                        onSuccess();
                    }
                });
            }
        }
    },{id:employee._id});

    employee.teamIds.push(team._id);
    employee.update(function(err,model){
        if(err){
            onFailure(errorCodes.ServicesErrorCodes.UnknownError);
        }
        else{
            onSuccess();
        }

    })
}

//get team from the database by team name
function getTeamByName(user, teamName, onSuccess, onFailure){
    teamModel.findOne(function(err,dbTeam){
        if(err){
            onFailure(errorCodes.ServicesErrorCodes.UnknownError);
        }else{
            onSuccess(dbTeam);
        }
    },{name:teamName});
}

//get from the database all employees that belongs to specific team id
function getEmployeesByTeamId(user, teamId, onSuccess, onFailure){
    //look for all employees which have the team id in their list of teams
    employeeModel.find(function(err,dbEmployees){
        if(err){
            onFailure(errorCodes.ServicesErrorCodes.UnknownError);
        }
        else{
            onSuccess(dbEmployees);
        }
    },{teamIds:{$in:[teamId]}});

}

//get members of team
exports.getMembersOfTeam=function(user,teamName,onSuccess, onFailure){

    getTeamByName(user,teamName,function(team){
        //Success
        getEmployeesByTeamId(user,team._id, function (dbEmployees) {
            //Success
            onSuccess(dbEmployees);
        }, function () {
            //Failure
            onFailure(errorCodes.ServicesErrorCodes.UnknownError);
        })
    }, function () {
        //Failure
        onFailure(errorCodes.ServicesErrorCodes.UnknownError);
    })
}

//remove member from team
exports.removeMemberFromTeam= function (user,team,employee,onSuccess, onFailure) {
}

//assign member as team leader
exports.assignTeamLeader=function(user,team,employee,onSuccess, onFailure){
}

//update team

//delete team