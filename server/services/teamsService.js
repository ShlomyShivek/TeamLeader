var teamModel = require('../dbModelsInitiator').getDbModel('team');
var employeeModel = require('../dbModelsInitiator').getDbModel('employee');
var errorCodes = require('../models/errorCodes/ErrorCodes');
var employeesService = require('./employeesService');
var serviceModels=require('../models/serviceModels');

//add new team for user
exports.addTeam=function(user, team, onSuccess, onFailure){
    if((team==null)||(team.name==null)||(team.name.trim()=='')){
        onFailure(errorCodes.ServicesErrorCodes.MissingData); //missing team name
    }
    getTeamByName(user,team.name,
        function(dbTeam){
            //got team from db
            if(dbTeam!=null){
                //team already exists
                onFailure(errorCodes.ServicesErrorCodes.ItemAlreadyExists);
            }else{
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
        },
        function(data){
           //failed to get team from the db
        });

}

//get all teams for user
exports.getTeams=function(user, onSuccess, onFailure){
    teamModel.find({deleted:null}, function (err, teams) {
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
            getTeamByName(user, teamName, function(dbTeam){
                console.log('team found');
                //team found
                var employeeAlreadyMemberOfTheTeam=false;

                dbTeam.members.forEach(function(memberId){
                    if(memberId==dbEmployee.id){
                        //employee is already member of this team
                        employeeAlreadyMemberOfTheTeam=true;
                    }
                })

                if(employeeAlreadyMemberOfTheTeam){
                    console.log('employee is already member of this team');
                    onFailure(errorCodes.ServicesErrorCodes.ItemAlreadyExists);
                }
                else{
                    dbTeam.members.push({employeeId:dbEmployee.id});
                    updateTeam(dbTeam, onSuccess, onFailure);
                }
            },onFailure);
        }else{
            onFailure(errorCodes.ServicesErrorCodes.UNKNOWN_ERR);
        }

    }, onFailure);
}

function updateTeam(dbTeam, onSuccess, onFailure) {
    console.log('updating team in database:' + dbTeam);
    dbTeam.save(function (err) {
        if (err) {
            console.log('failed to update employee as new team member:' + err);
            onFailure(errorCodes.ServicesErrorCodes.UnknownError);
        }
        else {
            console.log('team was updated');
            onSuccess();
        }
    })
}

//get team from the database by team name
exports.getTeamByName = function (user, teamName, onSuccess, onFailure){
    return getTeamByName(user,teamName,onSuccess,onFailure);
}

function getTeamByName(user, teamName, onSuccess, onFailure) {
    console.log('searching for team by name:'+teamName);

    //var query=teamModel.where('name', teamName);
    teamModel.findOne({name:teamName, deleted:null},function(err,dbTeam){
        if(err){
            onFailure(errorCodes.ServicesErrorCodes.UnknownError);
        }else{
            console.log('found team:'+dbTeam);
            onSuccess(dbTeam);
        }
    });
}

//get members of team
exports.getMembersOfTeam=function(user,teamName,onSuccess, onFailure) {

    getTeamByName(user, teamName, function (dbTeam) {
        //Success
        var employeesIds = new Array();

        dbTeam.members.forEach(function (member) {
            employeesIds.push(member.employeeId);
        });

        employeesService.getEmployeesByIds(employeesIds, function (employees) {
            //Success getting employee by ID
            onSuccess(employees);

        }, function (err) {
            //Failed to get employee by ID
            onFailure(errorCodes.ServicesErrorCodes.UnknownError);
        });
    });
}

//remove member from team
exports.removeMemberFromTeam= function (user,teamName,employeeName,onSuccess, onFailure) {
    if((teamName==null)||(employeeName==null)){
        onFailure(errorCodes.ServicesErrorCodes.MissingData);
    }else{
        var dbTeam=getTeamByName(user,teamName,function(dbTeam){
            //got team from db
            employeesService.searchEmployees(user,employeeName,true,function(dbEmployee){
                if(dbEmployee!=null){
                    //got the employee from the databaes
                    console.log('got employee from db. employee name ' +employeeName + ' employee ID ' + dbEmployee[0]._id.toString());
                    dbTeam.removeMember(dbEmployee[0]._id.id);
                    updateTeam(dbTeam,onSuccess,onFailure);
                }else{
                    console.log('could not find employee in database. name ' + employeeName);
                    onFailure(errorCodes.ServicesErrorCodes.EmployeeNotFound);
                }
            });
        },function(data){
            console.log('failed to get team name ' + teamName + ' from database');
        })
    }
}

//delete a team
exports.removeTeam=function(user, teamName, onSuccess, onFailure){
    if(teamName==null) {
        onFailure(errorCodes.ServicesErrorCodes.MissingData);
    }else{
        this.getTeamByName(user,teamName,
            function(dbTeam){
                //got the team details from database
                dbTeam.deleted=Date.now();
                updateTeam(dbTeam,
                    function(){
                       //team updated
                        onSuccess();
                    },
                    function(){
                        //failed to update team
                        onFailure();
                    });
            },
            function(data){
               //failed to get team from DB
                onFailure();
            });
    }

}

//assign member as team leader
exports.assignTeamLeader=function(user,teamName,employeeName,onSuccess, onFailure){
    if((teamName==null)||(employeeName==null)){
        onFailure(errorCodes.ServicesErrorCodes.MissingData);
    }else{
        var dbTeam=getTeamByName(user,teamName,function(dbTeam){
            //got team from db
            employeesService.searchEmployees(user,employeeName,true,function(dbEmployee){
                if(dbEmployee!=null){
                    //got the employee from the databaes
                    console.log('got employee from db. employee name ' +employeeName + ' employee ID ' + dbEmployee[0]._id.toString());
                    dbTeam.leaderId = dbEmployee[0]._id;
                    updateTeam(dbTeam,onSuccess,onFailure);
                }else{
                    console.log('could not find employee in database. name ' + employeeName);
                    onFailure(errorCodes.ServicesErrorCodes.EmployeeNotFound);
                }
            });
        },function(data){
            console.log('failed to get team name ' + teamName + ' from database');
        })
    }
}
