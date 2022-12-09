// collection
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var finalUsers = new Schema({
    "email": String,
    "password": String
});
let pass1 = encodeURIComponent("Kelvin@1234");
db = mongoose.createConnection(`mongodb+srv://KelvinV:${pass1}@senecaweb.rzvicok.mongodb.net/web322_week8?retryWrites=true&w=majority`);
const bcrypt = require('bcryptjs');
let User;
exports.startDB = () => {
    return new Promise((res, rej) => {
        
        if (!db) {
            err = "Cannot connect to DB.";
            rej(err);
        }
        else {
            User = db.model("users1", finalUsers);
            console.log("DB connection successful.");
            res();
        }
    })
}

exports.register = (user) => {
    return new Promise((res, rej) => {
        if (user.password.trim().length === 0 || user.email.trim().length === 0) {
            rej("Error: email or password cannot be empty.");
        }
        else {
            bcrypt.hash((user.password, 10).then(hash => {
                finalUsers.password = hash;
                let users = new User(user);
                users.save().then(() => {
                    res(user);
                }).catch((err) => {
                    if (err.code == 11000) {
                        rej(`Error: ${user.email} already exists`);
                    }
                    else {
                        rej("Error: cannot create the user");
                    }
                })
            }).catch(() => {
                rej("There was an error encrypting the password");
            }))
        }
    })
}

exports.signIn = (user) => {
    finalUsers.findOne({email: user.email}).exec().then((found) => {
        if (found.password != finalUsers.password) {
            rej(`Incorrect password for user ${found.email}`);
        }
        else {
            res(found);
        }
    })
}