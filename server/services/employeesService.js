var employeeModel = require('../dbModelsInitiator').getDbModel('employee');

//create new employee
exports.addEmployee=function(user,employee,onSuccess, onFailure){
    if((employee==null)||(employee.name==null)||(employee.name.trim()=='')){
        onFailure(errorCodes.ServicesErrorCodes.MissingData); //missing employee name
    }
    else {
        employee.save(function (err, model) {
            if (err) {
                console.log(err);
                if (err.code == 11000) {
                    onFailure(errorCodes.ServicesErrorCodes.DuplicateKey);
                }
                else {
                    onFailure(errorCodes.ServicesErrorCodes.UnknownError);
                }
            }
            else {
                console.log('New employee entered to DB:' + employee.toString());
                onSuccess();
            }
        });
    }
}

//search for employees
exports.searchEmployees= function(user,searchPattern, exactMatch ,onSuccess,onFailure){
    if(!exactMatch){
        searchPattern = new RegExp(searchPattern, "i")
    }
    console.log('searching for employee:' + searchPattern);
    employeeModel.find({ name: searchPattern },function (err, employees) {
        if (err) {
            console.log('failed to search for employees in DB:' + err);
            onFailure(errorCodes.ServicesErrorCodes.UnknownError);
        }
        else {
            var result = new Array();
            console.log('employee search result:' + employees);
            onSuccess(employees);
        }
    });
}

exports.getEmployeesByIds= function(employeesIds, onSuccess, onFailure){
    employeeModel.find({_id:{$in:employeesIds}},function (err, employees) {
        if (err) {
            console.log('failed to search for employees in DB:' + err);
            onFailure(errorCodes.ServicesErrorCodes.UnknownError);
        }
        else {
            var result = new Array();
            console.log('employee search result:' + employees);
            onSuccess(employees);
        }
    });
}
