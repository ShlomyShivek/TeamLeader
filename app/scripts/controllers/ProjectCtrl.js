define(['../app', '../services/nodeService'],function(myApp, serviceClient){
    myApp.controller('ProjectCtrl',['$scope','$http', '$route',function controller($scope, $http, $route){

        $scope.projectName=$route.current.params.projectName;
    }])
})


