const spicedPg = require("spiced-pg");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);
const { genSalt, hash } = require("bcryptjs");

let sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    const { dbUser, dbPass } = require("./secrets.json");
    var db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/petition`);
} else {
    var db = spicedPg(process.env.DATABASE_URL);
}

function clean(input) {
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
}

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
    firstname = clean(firstname);
    lastname = clean(lastname);
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
    if (!age && !city && !homepage) {
        console.log("No profile added");
        return Promise.resolve({});
    }
    city = clean(city);
    homepage = clean(homepage);
    if (!homepage.startsWith("http://") && !homepage.startsWith("https://")) {
        console.log("Homepage: ", homepage);
        homepage = "";
    }
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
            "SELECT * FROM users JOIN signatures ON users.id = signatures.user_id FULL JOIN user_profiles ON users.id = user_profiles.user_id WHERE signature != ''"
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
            "SELECT * FROM users JOIN signatures ON users.id = signatures.user_id JOIN user_profiles ON users.id = user_profiles.user_id WHERE signature != '' AND city ILIKE $1",
            [city]
        )
        .then((result) => {
            return result.rows;
        });
}

function getFullUser(user_id) {
    return db
        .query(
            "SELECT users.id, users.firstname, users.lastname, users.email, user_profiles.age, user_profiles.city, user_profiles.homepage FROM users FULL JOIN user_profiles ON users.id = user_profiles.user_id WHERE users.id = $1",
            [user_id]
        )
        .then((result) => {
            return result.rows[0];
        });
}

function hashPass(password) {
    return genSalt().then((salt) => {
        return hash(password, salt);
    });
}

function updateUser(user_id, firstname, lastname, email, password) {
    firstname = clean(firstname);
    lastname = clean(lastname);
    if (password) {
        hashPass(password).then((passwordhash) => {
            return db.query(
                `UPDATE users SET firstname = $1, lastname = $2, email = $3, passwordhash = $4 WHERE id = $5`,
                [firstname, lastname, email, passwordhash, user_id]
            );
        });
    } else {
        return db.query(
            `UPDATE users SET firstname = $1, lastname = $2, email = $3 WHERE id = $4`,
            [firstname, lastname, email, user_id]
        );
    }
}

function upsertProfile(user_id, age, city, homepage) {
    city = clean(city);
    homepage = clean(homepage);
    if (!homepage.startsWith("http://") && !homepage.startsWith("https://")) {
        console.log("Homepage: ", homepage);
        homepage = "";
    }
    return db.query(
        `INSERT INTO user_profiles (user_id, age, city, homepage)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id)
        DO UPDATE SET age = $2, city = $3, homepage = $4
        RETURNING *`,
        [user_id, +age, city, homepage]
    );
}

function upsertUser(user) {}

function deleteSignature(user_id) {
    return db.query("DELETE FROM signatures WHERE user_id = $1", [user_id]);
}

function deleteProfile(user_id) {
    return db.query("DELETE FROM user_profiles WHERE user_id = $1", [user_id]);
}
function deleteUser(user_id) {
    return db.query("DELETE FROM users WHERE id = $1", [user_id]);
}

function deleteAccount(user_id) {
    deleteSignature(user_id).then((result) => {
        deleteProfile(user_id).then((result) => {
            deleteUser(user_id).then((result) => {
                console.log("deleted user", user_id, result);
            });
        });
    });
}

// const user_id = 13;
// addSignature(user_id, "user13").then((result) => {
//     console.log("inser", result);
//     deleteSignature(user_id).then((result) => {
//         console.log("delte", result);
//     });
// });

module.exports = {
    getSignature,
    hasSigned,
    addSignature,
    getUsers,
    getNumUsers,
    getUserById,
    getUserByEmail,
    addUser,
    updateUser,
    addProfile,
    upsertProfile,
    getFullUser,
    getSupporters,
    getNumSupporters,
    getSupportersByCity,
    deleteSignature,
};
