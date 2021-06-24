const spicedPg = require("spiced-pg");
const { dbUser, dbPass } = require("./secrets.json");
var db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/petition`);

function getUsers() {
    return db
        .query("SELECT * FROM users")
        .then(function (result) {
            return result;
        })
        .catch(function (err) {
            console.log(err);
        });
}

function getUserById(id) {
    return db
        .query("SELECT * FROM users WHERE id = $1", [id])
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            console.log(error);
        });
}
function getUserByEmail(email) {
    return db
        .query("SELECT * FROM users WHERE email = $1", [email])
        .then(function (result) {
            return result.rows;
        })
        .catch(function (error) {
            console.log(error);
            return error;
        });
}

function getParticipants() {
    return db
        .query(`SELECT * FROM participants`)
        .then(function (result) {
            // console.log(result.rows);
            return result;
        })
        .catch(function (err) {
            console.log(err);
        });
}

// function getNumParticipants() {
//     return db
//         .query(`SELECT * FROM participants`)
//         .then(function (result) {
//             // console.log(result.rows);
//             return result;
//         })
//         .catch(function (err) {
//             console.log(err);
//         });
// }

function getParticipantById(id) {
    return db
        .query("SELECT * FROM participants WHERE id = $1", [id])
        .then(function (result) {
            // console.log(result.rows);
            return result;
        })
        .catch(function (err) {
            console.log(err);
        });
}

function getParticipantByEmail(email) {
    return db
        .query("SELECT * FROM participants WHERE email = $1", [email])
        .then(function (result) {
            // console.log(result.rows);
            return result;
        })
        .catch(function (err) {
            console.log(err);
        });
}

function addParticipant(firstname, lastname, signature) {
    return db
        .query(
            "INSERT INTO participants (firstname, lastname, signature) VALUES ($1, $2,$3) RETURNING *",
            [firstname, lastname, signature]
        )
        .then((result) => {
            // console.log("insert result", result);
            return result.rows[0].id;
        });
}

module.exports = {
    getParticipants,
    getParticipantById,
    addParticipant,
    getUsers,
    getUserById,
    getUserByEmail,
};
