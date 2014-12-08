define(['angular'], function(angular){

    //the session token to be used for every post message
    var sessionToken;

    //the service root URL
    var rootUrl='http://127.0.0.1:8081';
/*
    function post(http, url, body, onSuccess, onFailure){
        http.post(url,body)
            .success(onSuccess)
            .error(onFailure);
    }
*/

    return{
        login:function(credentials, http, onSuccess, onFailure){
            http.post(rootUrl + '/api/login', angular.toJson(credentials))
                .success(onSuccess)
                .error(onFailure);

        },

        setToken:function(http, token){
            this.sessionToken=token;
            http.defaults.headers.common.Authorization = 'Basic ' + token;
        },

        addNewProject:function(http, project, onSuccess, onFailure){
            http.post(rootUrl+'/api/projects', angular.toJson(project))
                .success(onSuccess)
                .error(onFailure);
        },

        getProjects:function(http, onSuccess, onFailure){
            http.get(rootUrl+'/api/projects')
                .success(onSuccess)
                .error(onFailure);
        },

        deleteProject: function (http,projectNameToDelete,onSuccess,onFailure) {
            http.delete(rootUrl+'/api/projects/' + projectNameToDelete)
                .success(onSuccess)
                .error(onFailure);
        },

        getTeams: function(http,onSuccess, onFailure){
            http.get(rootUrl+'/api/teams/')
                .success(onSuccess)
                .error(onFailure);
        },

        getTeamMembers: function(http, teamName, onSuccess, onFailure){
            http.get(rootUrl+'/api/teams/' + teamName)
                .success(onSuccess)
                .error(onFailure);
        },

        addNewTeam: function(http, teamName, onSuccess, onFailure) {
            http.post(rootUrl + '/api/teams/', angular.toJson(teamName))
                .success(onSuccess)
                .error(onFailure);
        },


        searchEmployees: function(http, searchPatterns, onSuccess, onFailure){
            http.get(rootUrl+'/api/employees/' + searchPatterns)
                .success(onSuccess)
                .error(onFailure);


            /*
            var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
                'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
                'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
                'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
                'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
                'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
                'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
                'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
                'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
            ];

            onSuccess(states);
            */
        },

        addNewEmployee: function(http, employee, onSuccess, onFailure){
            http.post(rootUrl+'/api/employees/',angular.toJson(employee))
                .success(onSuccess)
                .error(onFailure);
        }

    }
})
