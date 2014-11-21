var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function registerModel(schema) {
    var path = require('path');
    var fileName = module.filename.slice(__filename.lastIndexOf(path.sep) + 1, module.filename.length - 3);
    console.log('registering dbmodel:' + fileName);
    mongoose.model(fileName, schema);
}


module.exports = function() {
    var project = new Schema({
        projectName         : String
        , workingDays       : Number
        , startDate         : Date
        , finishDate        : Date
        , totalDevDays      : Number
        , availableDevDays  : Number

    });
    registerModel(project);
};

