const { genSalt, hash } = require("bcryptjs");
const db = require("./db");

function checkUserExists(email) {
    return db.getUserByEmail(email).then((result) => {
        if (result.length > 0) {
            return true;
        }
        return false;
    });
}

function hashPass(password) {
    return genSalt().then((salt) => {
        return hash(password, salt);
    });
}

// TODO: HANDLE USER ALREADY EXISTS
function register(firstname, lastname, email, password) {
    return checkUserExists(email).then((result) => {
        if (!result) {
            console.log("Creating new user", email);
            return hashPass(password).then((hashedPass) => {
                console.log(hashedPass);
                return db.addUser(firstname, lastname, email, hashedPass);
            });
        } else {
            console.log("User exists", email);
            throw new Error("User already exists!", email);
        }
    });
}

module.exports = register;
