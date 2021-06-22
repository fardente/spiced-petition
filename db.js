const spicedPg = require("spiced-pg");
const { dbUser, dbPass } = require("./secrets.json");
var db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/petition`);

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
    addParticipant,
};
