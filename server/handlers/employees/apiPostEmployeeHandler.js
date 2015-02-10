//the url path to be used for this handler
exports.path='/employees';

//the http verb to be used for this handler
exports.verb='POST';

exports.handleRequest=function(req, res){

    console.log('handling ' + JSON.stringify(req.route.methods) + ' ' + req.originalUrl + ' from:' + req.header('referer'));

    var errorCodes = require('../../models/errorCodes/ErrorCodes');

    var employeeService=require('../../services/employeesService');
    var teamsService=require('../../services/teamsService');
    var authenticationService=require('../../services/authenticationService');

    var sessionToken = req.header('Authentication');
    var user=authenticationService.getUser(sessionToken);

    var employeeModel = require('../../dbModelsInitiator').getDbModel('employee');
    var employee=new employeeModel();
    employee.name=req.body.name;

    console.log('about to submit new employee to teamsService:' + employee);

    employeeService.addEmployee(user, employee,function(data){
        //Success
        res.json({ message: 'new employee added' });
    }, function(data){
        //Failure
        console.log('failed to create new employee:' + data);
        if(data==errorCodes.ServicesErrorCodes.MissingData){
            res.status(400).json({err:errorCodes.ApiErrorCodes.MissingData,msg:'employee name missing', test:4});
        } else if (data==101){
            res.status(400).json({err:errorCodes.ApiErrorCodes.EmplyeeNameAlreadyExists , msg:'employee name already exists'});
        }else{
            res.status(400).json({err:errorCodes.ApiErrorCodes.UnknownError, msg:'unknown error occurred.'});
        }
    });
}