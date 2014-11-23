define(['../app', '../services/nodeService','../models/entitiesModels'],function(myApp, nodeService, entitiesModels){
    myApp.controller('TeamsEditorCtrl',['$scope','$http', '$location',function controller($scope, $http, $location){

        function initTeamsDropdown(){
            nodeService.getTeams($http, function(data){
                //onSuccess
                $scope.teams = data.teams;
            }, function(data){
                //onFailure
            });
        }

        $scope.membersOfSelectedTeam = null;
        $scope.selectedTeam = null;
        $scope.selectedTeamMember=null;


        //when the dropdown of selected team changes its value we call the server to get the list of
        //team members to display
        $scope.$watch('selectedTeam', function() {
            if($scope.selectedTeam!=null) {
                nodeService.getTeamMembers($http,$scope.selectedTeam.teamName,function(data){
                    //success
                    //mark the team leader
                    data.members.forEach(function(member){
                        member.isLeader = member.id==data.leaderId;
                    });
                    $scope.membersOfSelectedTeam = data.members;
                }, function(){
                    //failure
                    alert('could not get team members');
                });
            }
            else{
                $scope.membersOfSelectedTeam = null;
            }
        });

        $scope.teamMemberSelected=function(member){
            if($scope.selectedTeamMember==null){
                //set the clicked member as selected
                $scope.selectedTeamMember=member;
            } else if($scope.selectedTeamMember.id==member.id){
                //the same member clicked twice. clear selection
                $scope.selectedTeamMember=null;
            }else{
                //select another member
                $scope.selectedTeamMember=member;
            }

        }



        function initDialog(){
            $('#addNewMember').on('show.bs.modal', function (event) {
                //var button = $(event.relatedTarget) // Button that triggered the modal
                //var projectName = button.data('whatever'); // Extract info from data-* attributes
                //projectName=projectName.substring(0, projectName.length-1); //remove the extra '/' that comes from somewhere
                //$scope.selectedProjectForDelete=projectName;
                // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
                // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
                //var modal = $(this)
                //modal.find('.modal-title').text('Deleting project ' + projectName)
                //modal.find('.modal-body input').val(projectName)
            })


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


        initDialog();



        initTeamsDropdown();

    }])
})


