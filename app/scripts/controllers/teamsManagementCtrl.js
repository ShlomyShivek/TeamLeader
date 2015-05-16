define(['../app', '../services/nodeService','../models/entitiesModels'],function(myApp, nodeService, entitiesModels){
    myApp.controller('TeamsEditorCtrl',['$scope','$http', '$location',function controller($scope, $http, $location){

        $scope.selectedTeam = null;
        $scope.selectedTeamMember=null;
        $scope.selectedTeamMembers=null;
        $scope.addNewTeamError=null;

        //team selected
        $scope.teamSelected= function (team) {
            $scope.selectedTeam = team;
            teamSelected();
        }

        function teamSelected() {
            nodeService.getTeamMembers($http, $scope.selectedTeam.name, function (data) {
                //success
                $scope.selectedTeamLeader=null;
                if(data!=null) {
                    $scope.selectedTeamMembers = new Array();
                    data.Members.forEach(function (teamMember) {
                        if ((data.Leader!=null) && (data.Leader.name == teamMember.Employee.name) && ($scope.selectedTeamLeader==null)) {
                            $scope.selectedTeamLeader = teamMember.Employee;
                        }
                        else {
                            $scope.selectedTeamMembers.push(teamMember.Employee);
                        }

                    });
                }
            }, function () {
                //failure
                alert('could not get team members');
            });
        }

        $scope.setTeamLeader=function(team, teamMember){
            nodeService.setTeamLeader($http,team,teamMember,
                function(data){
                    //success
                    teamSelected();
                }, function(data){
                    // failure
                    alert(data.message);
                });
        }

        $scope.removeFromTeam=function(team, teamMember) {
            nodeService.removeFromTeam($http,team,teamMember,
                function(data){
                    //success
                    //alert('employee was removed from the team');
                    teamSelected();
                }, function(data){
                    // failure
                    alert(data.message);
                });
        }

        //team member selected
        $scope.teamMemberSelected=function(member) {
            if ($scope.selectedTeamMember == null) {
                //set the clicked member as selected
                $scope.selectedTeamMember = member;

                //disable all other members
                $("button[memberId]").each(function (index) {
                    if ($(this).attr("memberId") != member.id) {
                        $(this).addClass("disabled");
                    }
                })

            } else if ($scope.selectedTeamMember.id == member.id) {
                //the same member clicked twice. clear selection
                $scope.selectedTeamMember = null;
                //allow selecting any other member
                $("button[memberId]").each(function (index) {
                    $(this).removeClass("disabled");
                })
            }
        }

        $scope.deleteTeam=function (team){
            nodeService.deleteTeam($http,team,
                function(){
                    //team deleted successfully
                    $scope.selectedTeam = null;
                    $scope.selectedTeamMember=null;
                    $scope.selectedTeamMembers=null;
                    $scope.addNewTeamError=null;
                    initTeams();
                },
                function(){
                    //failed to delete team
                });
        }

        //init events for the "Add New Team" dialog
        function initAddNewTeamDialog(){
            $scope.addNewTeamError="";
            $('#submitNewTeam').click(function () {
                var teamModel = new entitiesModels.teamModel();
                teamModel.name = $scope.newTeamName;


               nodeService.addNewTeam($http, teamModel, function(data){
                   //Success
                   $('#addNewTeam').modal('hide');
                   $('#newTeamName').val('');
                   initTeams();
               }, function(data){
                   //Failure
                   if(data.err==103){
                       //team name already exists
                       $scope.addNewTeamError = "Team name already exists";
                   }
               })
            });
        }
        initAddNewTeamDialog();

        //init events for the "Add New Member" dialog
        function initAddNewMemberDialog(){
            $('#submitNewDeveloper').click(function(){
                var employeeModel = new entitiesModels.employeeModel();
                employeeModel.name = $('#newDeveloperName').val();



                var existingEmployee=false;
                //check if this is a new or existing employee
                lastEmployeeSearchResult.forEach(function (empl) {
                   if(empl.name.trim()==employeeModel.name.trim()){
                       //this is existing employee
                       existingEmployee=true;
                   }
                });

                //if new employee - create a new employee first
                if(existingEmployee) {
                    console.log('employee already existing.... no need to create new one');
                    //add the employee to the team
                    addNewTeamMember(employeeModel,$scope.selectedTeam);
                }else {
                    console.log('submitting new developer named:' + employeeModel.name + ' for team:' + $scope.selectedTeam.name);

                    nodeService.addNewEmployee($http, employeeModel, function (data) {
                        //Success
                        console.log('new employee added successfully');
                        addNewTeamMember(employeeModel,$scope.selectedTeam);
                    }, function (data) {
                        //Error
                        console.log('failed to add new employee. err:' + data.err + ' msg:' + data.msg);
                        alert('Failed to add new employee');
                    });
                }

                $('#addNewMember').modal('hide');
                $('#newDeveloperName').val('');
            })

        }
        initAddNewMemberDialog();

        function addNewTeamMember(employee, team){
            nodeService.addTeamMember($http,employee,team,
            function(data){
                //success
                teamSelected();
            }, function(data){
                // failure
                    alert('Failed to add member to team:' + data.message);
                });
        }

        //init the list of teams from the server
        function initTeams(){
            nodeService.getTeams($http, function(data){
                //onSuccess
                $scope.teams = data.sort(function(a,b){return a.name.toString().localeCompare(b.name);});
            }, function(data){
                //onFailure
            });
        }
        initTeams();


        var lastEmployeeSearchResult;

        //initialize the typeahead developers search
        var substringMatcher = function() {
            return function findMatches(q, cb) {


                if((q!=null) && (q.trim()!='')) {
                    nodeService.searchEmployees($http, q, function (data) {
                            //success
                            lastEmployeeSearchResult=data.searchResult;

                            var matches, substrRegex;

                            // an array that will be populated with substring matches
                            matches = [];

                            // regex used to determine if a string contains the substring `q`
                            substrRegex = new RegExp(q, 'i');

                            // iterate through the pool of strings and for any string that
                            // contains the substring `q`, add it to the `matches` array
                            $.each(lastEmployeeSearchResult, function(i, str) {
                                if (substrRegex.test(str.name)) {
                                    // the typeahead jQuery plugin expects suggestions to a
                                    // JavaScript object, refer to typeahead docs for more info
                                    matches.push({ value: str.name, id:str._id });
                                }
                            });

                            cb(matches);

                            /*
                            //after the search result are rendered we register an event for each one so we will
                            //know which one was selected
                            $('.tt-dataset-employees').children().each(function(i){
                                $('.tt-dataset-employees').children(i).click(function(){
                                    alert('a');
                                });
                            });
                            */

                        },
                        function (data) {
                            //failure
                        });
                }


            };
        };

        $('#the-basics .typeahead').typeahead({
                hint: true,
                highlight: true,
                minLength: 1
            },
            {
                name: 'employees',
                displayKey: 'value',
                source: substringMatcher()
            });

    }])
})


