/*
Remove team
 */
//the url path to be used for this handler
exports.path='/teams/:teamName';

//the http verb to be used for this handler
exports.verb='DELETE';


exports.handleRequest=function(req, res){

    console.log('handling ' + JSON.stringify(req.route.methods) + ' ' + req.originalUrl + ' from:' + req.header('referer'));

    var teamsService=require('../../services/teamsService');
    var authenticationService=require('../../services/authenticationService');

    var sessionToken = req.header('Authentication');
    var user=authenticationService.getUser(sessionToken);

    var requestTeamName = req.params.teamName;

    teamsService.removeTeam(user,requestTeamName, function (data) {
        //Success
        res.status(200).json({ message: 'team deleted' });
    },function(data){
       //Failure
        console.log('failed to delete team');
        if(data==100){
            res.status(400).json({err:100,message:'team name missing'});
        } else if (data==101){
            res.status(400).json({err:101, message:'team name already exists'});
        }else{
            res.status(400).json({err:1, message:'unknown error occurred.'});
        }

    });
}