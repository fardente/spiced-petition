// const { compare, genSalt, hash } = require("bcryptjs");
const db = require("./db");
const bcrypt = require("bcryptjs");

function login(email, password) {
    return db
        .getUserByEmail(email)
        .then((user) => {
            if (user.length != 1) {
                console.log("Login, User 404");
                return;
            }
            user = user[0];
            const { id, firstname, lastname, passwordhash } = user;
            return bcrypt.compare(password, passwordhash).then((res) => {
                return id;
            });
        })
        .catch((error) => {
            console.log(console.log(error));
        });
}

module.exports = login;
