define(['../app', '../services/nodeService', '../models/authenticationModel'],function(myApp, serviceClient, authenticationModel){
    myApp.controller('LoginCtrl',['$scope','$http',function controller($scope, $http){
        $scope.login=function(){

            var userCredentials=new authenticationModel.credentialsModel();
            userCredentials.username=$scope.userName;
            userCredentials.password=$scope.password;

            serviceClient.login(userCredentials, $http,
                function(data){//on success
                    alert(data.message);
                },
                function(data){//on failure
                    alert(data);
                });
        }
    }])
})


