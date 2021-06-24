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

function getNumUsers() {
    return getUsers().then((result) => {
        return result.rowCount;
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

function addUser(firstname, lastname, email, passwordhash) {
    return db
        .query(
            "INSERT INTO users (firstname, lastname, email, passwordhash) VALUES ($1, $2,$3, $4) RETURNING *",
            [firstname, lastname, email, passwordhash]
        )
        .then((result) => {
            // console.log("insert result", result);
            return result.rows[0];
        });
}

function addProfile(user_id, age, city, homepage) {
    return db
        .query(
            "INSERT INTO user_profiles (user_id, age, city, homepage) VALUES ($1, $2, $3, $4) RETURNING *",
            [user_id, age, city, homepage]
        )
        .then((result) => {
            return result.rows[0];
        });
}

function getSignature(user_id) {
    return db
        .query("SELECT signature FROM signatures WHERE user_id = $1", [user_id])
        .then((result) => {
            console.log("Getting signature from db");
            return result.rows[0].signature;
        })
        .catch((error) => {
            console.log("ERROR getting signature", error);
        });
}

function hasSigned(user_id) {
    return getSignature(user_id).then((result) => {
        if (result) {
            return true;
        }
        return false;
    });
}

function addSignature(user_id, signature) {
    return db
        .query(
            "INSERT INTO signatures (user_id, signature) VALUES ($1, $2) RETURNING *",
            [user_id, signature]
        )
        .then((result) => {
            // console.log("insert result", result);
            return result.rows[0].id;
        });
}

function getSupporters() {
    return db
        .query(
            "SELECT * FROM users JOIN signatures ON users.id = signatures.user_id JOIN user_profiles ON users.id = user_profiles.user_id WHERE signature != ''"
        )
        .then((result) => {
            return result;
        });
}

function getNumSupporters() {
    return getSupporters().then((result) => {
        return result.rowCount;
    });
}

function getSupportersByCity(city) {
    return db
        .query(
            "SELECT * FROM users JOIN signatures ON users.id = signatures.user_id JOIN user_profiles ON users.id = user_profiles.user_id WHERE signature != '' AND city = $1",
            [city]
        )
        .then((result) => {
            return result.rows;
        });
}

module.exports = {
    getSignature,
    hasSigned,
    addSignature,
    getUsers,
    getNumUsers,
    getUserById,
    getUserByEmail,
    addUser,
    addProfile,
    getSupporters,
    getNumSupporters,
    getSupportersByCity,
};
