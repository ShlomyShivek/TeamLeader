define(['../app', '../services/nodeService','../models/entitiesModels'],function(myApp, nodeService, entitiesModels){
    myApp.controller('AddNewProjectCtrl',['$scope','$http', '$location',function controller($scope, $http, $location){

        $scope.initDatePicker=function(){
            $('#projectDuration-container .input-daterange').datepicker({
                keyboardNavigation: false,
                autoclose: true,
                todayHighlight: true
            });
        }

        $scope.saveProject=function(){
            //on success
                    $scope.$apply(); //need to call apply since the project start and end dates were updated from the datepicker control and not from angular
                    var projectModel = new entitiesModels.projectModel();
                    projectModel.projectName = $scope.projectName;
                    projectModel.workingDays = $scope.workingDays;
                    projectModel.startDate = $scope.projectStart;
                    projectModel.finishDate = $scope.projectEnds;

                    nodeService.addNewProject($http, projectModel, function () {

                    $location.path('/dashboard');
            }, function(){
                //on failure
                    alert('failed to add project');
                }
            );
            
            //$location.path('/dashboard');
        };

        $scope.cancel=function(){
            $location.path('/dashboard');
        };

        /*
                $scope.helloMsg="Hello World!!!";

                $scope.TestService=function(){
                    serviceClient.getTestDataFromServer($http,onSuccessGetDataFromNodeServer,onFailureGetDataFromNodeServer);
                }

                function onSuccessGetDataFromNodeServer(data){
                    $scope.serviceOutput=data;
                }

                function onFailureGetDataFromNodeServer(data){
                    $scope.serviceOutput=data;
                }
        */

        $scope.initDatePicker();

    }])
})


