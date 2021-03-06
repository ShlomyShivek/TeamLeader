'use strict';

require.config({
    baseUrl:'scripts',
    paths:{
        text:'lib/require/text',
        jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min',
        jqueryUI: 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min',
        jqueryCookie: 'lib/jquery/jquery.cookie',
        wizard: 'lib/jwizard/jquery.jWizard.min',
        angular: 'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular.min',
        ngRoute: 'http://ajax.googleapis.com/ajax/libs/angularjs/1.2.4/angular-route.min',
        bootstrap: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min',
        datepicker: 'lib/datepicker/js/bootstrap-datepicker',
        typeahead: 'lib/typeahead/dist/typeahead.jquery.min'
    },
    shim:{
        'angular':{
            exports: 'angular'
        },
        'ngRoute': ['angular'],
        'jqueryUI': ['jquery'],
        'jwizard': ['jqueryUI'],
        'bootstrap': ['jquery'], //states that bootstrap depends on first loading the jQuery
        'datepicker':['jquery'],
        'typeahead':['jquery']
    },
    priority:[
        'angular'
    ],
    urlArgs:'v=0.8'
});

require([
    'angular',
    'ngRoute',
    'text',
    'app',
    'jquery',
    'routes',
    'bootstrap',
    'datepicker',
    'typeahead'
], function (angular) {
    //This function will be called when all the dependencies
    //listed above are loaded. Note that this function could
    //be called before the page is loaded.
    //This callback is optional.

    $(document).ready(function () {
        angular.bootstrap(document, ['myApp']);
    });
});