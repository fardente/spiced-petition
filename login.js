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
            console.log("Login, User exists", user[0]);

            user = user[0];

            const { id, firstname, lastname, passwordhash } = user;
            console.log(
                "Login userdata",
                id,
                firstname,
                lastname,
                passwordhash
            );

            return bcrypt.compare(password, passwordhash).then((res) => {
                console.log("compare: ", res);
                return id;
            });
        })
        .catch((error) => {
            console.log(console.log(error));
        });
}

module.exports = login;
