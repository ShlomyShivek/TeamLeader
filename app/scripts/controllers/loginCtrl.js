define(['../app', '../services/nodeService', '../models/authenticationModel'],function(myApp, nodeService, authenticationModel){
    myApp.controller('LoginCtrl',['$scope','$http', '$location', '$rootScope',function controller($scope, $http, $location, $rootScope){
        $scope.login=function(){

            var userCredentials=new authenticationModel.credentialsModel();
            userCredentials.username=$scope.userName;
            userCredentials.password=$scope.password;

            nodeService.login(userCredentials, $http,
                function(data){//on success
                    nodeService.setToken($http, data.token);
                    $location.path('/dashboard');
                },
                function(data){//on failure
                    alert(data);
                });
        }
    }])
})


