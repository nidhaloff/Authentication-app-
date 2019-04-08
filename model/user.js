const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);
const bcrypt = require("bcryptjs");

mongoose.connect('mongodb://localhost/nodeauth', { useNewUrlParser: true }, (err, db) => {
    if(err)
        console.log("Error", err);
    else
        console.log("connected");
});

let db = mongoose.connection;

//user Schema
const UserSchema = mongoose.Schema({

    username : {
        type : String,
        index : true
    },
    password : {
        type : String,
      
    }, 
    email : {
        type : String,
       
    },
    name : {
        type : String,
       
    }/* ,
    profileimage : {
        type : String
    } */
});

let User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback) {
    var query = {username : username};
    User.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch)=> {
        callback(null,isMatch);
    })
}
module.exports.createUser = (newUser, callback)=> {
    bcrypt.genSalt(10, (err, salt)=> {
        bcrypt.hash(newUser.password, salt, (err, hash)=> {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}


