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
                if (res) {
                    return id;
                }
                throw new Error("Wrong Password");
            });
        })
        .catch((error) => {
            console.log("loginfunc", error);
        });
}

module.exports = login;
