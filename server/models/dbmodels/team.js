//db.teams.ensureIndex({"name":1},{unique:true, sparse:true})


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function registerModel(schema) {
    var path = require('path');
    var fileName = module.filename.slice(__filename.lastIndexOf(path.sep) + 1, module.filename.length - 3);
    console.log('registering dbmodel:' + fileName);
    mongoose.model(fileName, schema);
}


module.exports = function() {
    var team = new Schema({
        name         : String
    });
    registerModel(team);
};

