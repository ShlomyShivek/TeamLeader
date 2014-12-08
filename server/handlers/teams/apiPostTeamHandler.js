//the url path to be used for this handler
exports.path='/teams';

//the http verb to be used for this handler
exports.verb='POST';


exports.handleRequest=function(req, res){

    console.log('handling ' + JSON.stringify(req.route.methods) + ' ' + req.originalUrl + ' from:' + req.header('referer'));

    var teamsService=require('../../services/teamsService');
    var authenticationService=require('../../services/authenticationService');

    var sessionToken = req.header('Authentication');
    var user=authenticationService.getUser(sessionToken);

    var teamModel = require('../../dbModelsInitiator').getDbModel('team');
    var team=new teamModel(req.body);

    console.log(team);

    teamsService.addTeam(user, team,function(data){
        //Success
        res.json({ message: 'new team added' });
    }, function(data){
        //failure
        console.log('failed to create new team');
        if(data==100){
            res.status(400).json({err:100,message:'team name missing'});
        } else if (data==101){
            res.status(400).json({err:101, message:'team name already exists'});
        }else{
            res.status(400).json({err:1, message:'unknown error occurred.'});
        }
    });
}