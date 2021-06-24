const { genSalt, hash } = require("bcryptjs");
const db = require("./db");

function addProfile(user_id, age, city, homepage) {
    return db.addProfile(user_id, age, city, homepage).then((result) => {
        console.log("adding Profile", result);
        return result;
    });
}

module.exports = addProfile;
