define(['../app', '../services/nodeService','../models/entitiesModels'],function(myApp, nodeService, entitiesModels){
    myApp.controller('TeamsEditorCtrl',['$scope','$http', '$location',function controller($scope, $http, $location){

        $scope.selectedTeam = null;
        $scope.selectedTeamMember=null;
        $scope.selectedTeamMembers=null;

        //team selected
        $scope.teamSelected= function (team) {
            $scope.selectedTeam = team;
            teamSelected();
        }


        function teamSelected() {
            nodeService.getTeamMembers($http, $scope.selectedTeam.teamName, function (data) {
                //success
                $scope.selectedTeamMembers=new Array();
                data.members.forEach(function (member) {
                    if(member.id == data.leaderId){
                        $scope.selectedTeamLeader=member;
                    }
                    else{
                      $scope.selectedTeamMembers.push(member);
                    }

                });
            }, function () {
                //failure
                alert('could not get team members');
            });
        }

        $scope.newDeveloperName=null;

        $scope.$watch('newDeveloperName', function (newValue, oldValue) {
            //alert($('#newDeveloperName').val);
            //$('#newDeveloperName').Typeahead('["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Dakota","North Carolina","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]');
/*
            if(newValue.trim()!='') {
                nodeService.searchDevelopersOnServer($http, newValue, function (data) {
                        //success
                    },
                    function (data) {
                        //failure
                    });
            }
            */
        })


        //team member selected
        $scope.teamMemberSelected=function(member){
            $("button[memberId]").each(function (index) {
                if($(this).attr("memberId") != member.id){
                    $(this).addClass("disabled");
                }
            })

            if($scope.selectedTeamMember==null){
                //set the clicked member as selected
                $scope.selectedTeamMember=member;

                $("button[memberId]").each(function (index) {
                    if($(this).attr("memberId") != member.id){
                        $(this).addClass("disabled");
                    }
                })

            } else if($scope.selectedTeamMember.id==member.id){
                //the same member clicked twice. clear selection
                $scope.selectedTeamMember=null;

                $("button[memberId]").each(function (index) {
                    $(this).removeClass("disabled");
                })
            }
        }


        //init events for the "Add New Member" dialog
        function initAddNewMemberDialog(){


            //$('#addNewMember').on('show.bs.modal', function (event) {
                //var button = $(event.relatedTarget) // Button that triggered the modal
                //var projectName = button.data('whatever'); // Extract info from data-* attributes
                //projectName=projectName.substring(0, projectName.length-1); //remove the extra '/' that comes from somewhere
                //$scope.selectedProjectForDelete=projectName;
                // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
                // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
                //var modal = $(this)
                //modal.find('.modal-title').text('Deleting project ' + projectName)
                //modal.find('.modal-body input').val(projectName)
            //})


            //jQuery to the rescue........
            $('#submitNewDeveloper').click(function(){
                /*
                nodeService.deleteProject($http,$scope.selectedProjectForDelete,function(){
                    //success
                    //refresh the projects table
                    initProjects();
                }, function(){
                    //falure
                });
                */
                alert('submitting new developer named:' + $('#newDeveloperName').val() + ' for team:' + $scope.selectedTeam.teamName);
                $('#addNewMember').modal('hide');
                $('#newDeveloperName').val('');

            })

        }
        initAddNewMemberDialog();


        //init the list of teams from the server
        function initTeams(){
            nodeService.getTeams($http, function(data){
                //onSuccess
                $scope.teams = data.teams;
            }, function(data){
                //onFailure
            });
        }
        initTeams();


        //initialize the typeahead developers search
        var substringMatcher = function() {
            return function findMatches(q, cb) {


                if((q!=null) && (q.trim()!='')) {
                    nodeService.searchDevelopers($http, q, function (data) {
                            //success
                            strs=data;

                            var matches, substrRegex;

                            // an array that will be populated with substring matches
                            matches = [];

                            // regex used to determine if a string contains the substring `q`
                            substrRegex = new RegExp(q, 'i');

                            // iterate through the pool of strings and for any string that
                            // contains the substring `q`, add it to the `matches` array
                            $.each(strs, function(i, str) {
                                if (substrRegex.test(str)) {
                                    // the typeahead jQuery plugin expects suggestions to a
                                    // JavaScript object, refer to typeahead docs for more info
                                    matches.push({ value: str });
                                }
                            });

                            cb(matches);
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
                name: 'states',
                displayKey: 'value',
                source: substringMatcher()
            });

    }])
})


