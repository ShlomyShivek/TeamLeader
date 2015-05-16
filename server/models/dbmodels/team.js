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
        name            : String,
        members         :[{employeeId:Schema.Types.ObjectId}],
        leaderId        : Schema.Types.ObjectId,
        deleted         : Date
    });

    team.methods.removeMember=function(employeeId) {
        for (var i = 0; i < this.members.length; i++) {
            if (this.members[i].employeeId.id == employeeId) {
                this.members.splice(i, 1);
                break;
            }
        }
    };

    registerModel(team);
};

