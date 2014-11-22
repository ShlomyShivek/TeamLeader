define(['../app', '../services/nodeService','../models/entitiesModels'],function(myApp, nodeService, entitiesModels){
    myApp.controller('DashboardCtrl',['$scope','$http',function controller($scope, $http){

        function initProjects(){
            nodeService.getProjects($http,
                function(data){
                    //success
                    data.forEach(function(project) {
                        project.startDate=new Date(project.startDate);
                        project.finishDate=new Date(project.finishDate);
                    });

                    $scope.projects = data;
                },
                function (data) {
                    //failure
                })
        }

        function initDialog(){
            $('#myModal').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget) // Button that triggered the modal
                var projectName = button.data('whatever'); // Extract info from data-* attributes
                projectName=projectName.substring(0, projectName.length-1); //remove the extra '/' that comes from somewhere
                $scope.selectedProjectForDelete=projectName;
                // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
                // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
                var modal = $(this)
                modal.find('.modal-title').text('Deleting project ' + projectName)
                modal.find('.modal-body input').val(projectName)
            })

            //jQuery to the rescue........
            $('#saveDelete').click(function(){
                nodeService.deleteProject($http,$scope.selectedProjectForDelete,function(){
                    //success
                    //refresh the projects table
                    initProjects();
                }, function(){
                    //falure
                });
                $('#myModal').modal('hide');
            })
        }

        initProjects();
        initDialog();
    }])
})


