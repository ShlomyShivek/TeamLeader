define(['../app', '../services/nodeService','../models/entitiesModels'],function(myApp, nodeService, entitiesModels){
    myApp.controller('AddNewProjectCtrl',['$scope','$http', '$location',function controller($scope, $http, $location){

        initDatePicker=function(){
            $('#projectDuration-container .input-daterange').datepicker({
                keyboardNavigation: false,
                autoclose: true,
                todayHighlight: true
            });
        }

        $scope.saveProject=function(){
            //on success
                //since the date values are entered from javascript they will not be loaded in the $scope.
                //we use jquery to retrieve them
                var startDate = $('#start').datepicker('getDate');
                var endDate = $('#end').datepicker('getDate');

                var projectModel = new entitiesModels.projectModel();
                projectModel.projectName = $scope.projectName;
                projectModel.workingDays = $scope.workingDays;
                projectModel.startDate = startDate;
                projectModel.finishDate = endDate;

                nodeService.addNewProject($http, projectModel, function () {

                $location.path('/dashboard');
            }, function(){
                //on failure
                    alert('failed to add project');
                }
            );
        };

        $scope.cancel=function(){
            $location.path('/dashboard');
        };

        function initNumberOnlyControl(){
            $(document).ready(function () {
                //called when key is pressed in textbox
                $("#workingDays").keypress(function (e) {
                    //if the letter is not digit then display error and don't type anything
                    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                        //display error message
                        $("#errmsg").html("Digits Only").show().fadeOut("slow");
                        return false;
                    }
                });
            });
        }

        initNumberOnlyControl();


        initDatePicker();

    }])
})


