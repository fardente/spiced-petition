// const { compare, genSalt, hash } = require("bcryptjs");
const db = require("./db");
const bcrypt = require("bcryptjs");

function login(email, password) {
    return db
        .getUserByEmail(email)
        .then((result) => {
            if (result.length != 1) {
                console.log("Login, User 404");
                return;
            }
            console.log("Login, User exists", result[0]);

            result = result[0];

            const { id, firstname, lastname, passwordhash } = result;
            console.log(
                "Login userdata",
                id,
                firstname,
                lastname,
                passwordhash
            );

            return bcrypt.compare(password, passwordhash).then((res) => {
                console.log("compare: ", res);
                return res;
            });
        })
        .catch((error) => {
            console.log(console.log(error));
        });
}

module.exports = login;
