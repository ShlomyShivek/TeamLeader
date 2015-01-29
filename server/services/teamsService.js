var teamModel = require('../dbModelsInitiator').getDbModel('team');
var employeeModel = require('../dbModelsInitiator').getDbModel('employee');
var errorCodes = require('../models/errorCodes/ErrorCodes');
var employeesService = require('./employeesService');

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





//add employee to team
exports.addEmployeeToTeam=function(user,employeeName,teamName,onSuccess, onFailure) {
    //get the employee details from the database
    employeesService.searchEmployees(user,employeeName, true,function(data){
       //success
        console.log('employee found. adding employee to team');
        if((data!=null)&&(data.length==1)) {
            var dbEmployee = data[0];
            if (dbEmployee.teams == null) {
                dbEmployee.teams = new Array();
            }

            console.log('searching for team name' + teamName);
            //find the team from the database
            getTeamByName(user, teamName, function(data){
                console.log('team found');
                //team found
                var dbTeam=data;

                var employeeAlreadyMemberOfTheTeam=false;


                dbEmployee.teams.forEach(function(teamOfEmployee){
                    if(teamOfEmployee.id.toString()==dbTeam._id.toString()){
                        //employee is already member of this team
                        employeeAlreadyMemberOfTheTeam=true;
                    }
                });

                if(employeeAlreadyMemberOfTheTeam){
                    console.log('employee is already member of this team');
                    onFailure(errorCodes.ServicesErrorCodes.ItemAlreadyExists);
                }
                else{
                    dbEmployee.teams.push({id:data._id,role:1});
                    console.log('updating employee in database:'+dbEmployee);
                    dbEmployee.save(function(err){
                        if (err) {
                            console.log('failed to update employee as new team member:' + err);
                            onFailure(errorCodes.ServicesErrorCodes.UnknownError);
                        }
                        else {
                            console.log('employee was updated as a new team member');
                            onSuccess();
                        }
                    });
                }
            },onFailure);
        }else{
            onFailure(errorCodes.ServicesErrorCodes.UNKNOWN_ERR);
        }

    }, onFailure);
}

//get team from the database by team name
function getTeamByName(user, teamName, onSuccess, onFailure){
    console.log('searching for team by name:'+teamName);

    //var query=teamModel.where('name', teamName);
    teamModel.findOne({name:teamName},function(err,dbTeam){
        if(err){
            onFailure(errorCodes.ServicesErrorCodes.UnknownError);
        }else{
            console.log('found team:'+dbTeam);
            onSuccess(dbTeam);
        }
    });
}

//get from the database all employees that belongs to specific team id
function getEmployeesByTeamId(user, teamId, onSuccess, onFailure){
    //look for all employees which have the team id in their list of teams
    employeeModel.find({"teams.id":{$in:[teamId]}},function(err,dbEmployees){
        if(err){
            onFailure(errorCodes.ServicesErrorCodes.UnknownError);
        }
        else{
            onSuccess(dbEmployees);
        }
    });
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