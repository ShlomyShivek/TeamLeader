define([
        'app',
        'controllers/dashboardCtrl',
        'controllers/teamsEditorCtrl',
        'controllers/helloWorldCtrl',
        'controllers/loginCtrl',
        'controllers/addNewProjectCtrl',
        'controllers/readmeCtrl',
        'controllers/homeCtrl'
     ],
    function (mainApp) {

        return mainApp.config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/home', { controller: 'HomeCtrl', templateUrl: '/templates/home.html' });
            $routeProvider.when('/login', { controller: 'LoginCtrl', templateUrl: '/templates/login.html' });
            $routeProvider.when('/dashboard', { controller: 'DashboardCtrl', templateUrl: '/templates/dashboard.html' });
            $routeProvider.when('/addproject', { controller: 'AddNewProjectCtrl', templateUrl: '/templates/addNewProject.html' });
            $routeProvider.when('/teams', { controller: 'TeamsEditorCtrl', templateUrl: '/templates/teamsEditor.html' });


            $routeProvider.when('/helloWorld', { controller: 'HelloWorldCtrl', templateUrl: '/templates/helloWorld.html' });
            $routeProvider.when('/readme', { controller: 'ReadMeCtrl', templateUrl: '/templates/readme.html' });
            /*$routeProvider.when('/{url}', { controller: '{controllerName}', templateUrl: '/partials/{templateName}.html' });*/
            $routeProvider.otherwise({ redirectTo: '/home' });
    }]);
});