define(['../app', '../services/nodeService','../models/entitiesModels'],function(myApp, nodeService, entitiesModels){
    myApp.controller('DashboardCtrl',['$scope','$http',function controller($scope, $http){

        function initProjects(){

            /*
            var mockProjects=new Array();
            for(var i=0;i<10;i++) {
                var project = new entitiesModels.projectModel();
                project.projectName = "Proj"+i;
                project.finishDate = "01/01/2010";
                project.startDate = "01/01/2000";
                project.workingDays = 20;
                project.totalDevDays = 2000;
                project.availableDevDays = 20;
                mockProjects.push(project);
            }
            $scope.projects = mockProjects;
            */

            nodeService.getProjects($http,
                function(data){
                    //success
                    $scope.projects = data;
                },
                function (data) {
                    //failure
                })

        }

        initProjects();
    }])
})


