define([
        'app',
        'controllers/helloWorldCtrl',
        'controllers/loginCtrl',
        'controllers/readmeCtrl',
        'controllers/homeCtrl'
     /* ,'{pathToControllerFile}' */],
    function (mainApp) {

        return mainApp.config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/home', { controller: 'HomeCtrl', templateUrl: '/templates/home.html' });
            $routeProvider.when('/login', { controller: 'LoginCtrl', templateUrl: '/templates/login.html' });


            $routeProvider.when('/helloWorld', { controller: 'HelloWorldCtrl', templateUrl: '/templates/helloWorld.html' });
            $routeProvider.when('/readme', { controller: 'ReadMeCtrl', templateUrl: '/templates/readme.html' });
            /*$routeProvider.when('/{url}', { controller: '{controllerName}', templateUrl: '/partials/{templateName}.html' });*/
            $routeProvider.otherwise({ redirectTo: '/home' });
    }]);
});