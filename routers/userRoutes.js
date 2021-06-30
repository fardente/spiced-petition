const express = require("express");
const mw = require("../middleware");
const db = require("../db");
const register = require("../register");
const login = require("../login");
const profile = require("../profile");
const addProfile = require("../profile");
const router = express.Router();

router.get("/login", mw.requireLoggedOut, function (request, response) {
    response.render("login", {
        petitionTitle:
            "Sign our petition to employ necromancy for the resurrection of Michael Jackson so he can save Pop Music!",
        login: 1,
    });
});

router.post("/login", mw.requireLoggedOut, function (request, response) {
    const { email, password } = request.body;
    login(email, password)
        .then((user_id) => {
            if (user_id) {
                request.session.user_id = user_id;
                db.getNumSupporters().then((numSupporters) => {
                    request.session.numSupporters = numSupporters;
                    response.redirect("/");
                });
                return;
            }
            response.redirect("/login");
        })
        .catch((error) => {
            console.log("signerror", error);
            response.redirect("/login");
        });
});

router.post("/logout", mw.requireLoggedIn, function (request, response) {
    request.session.user_id = "";
    request.session.signed = "";
    request.session.numSupporters = "";
    response.redirect("/");
});

router.get("/register", mw.requireLoggedOut, function (request, response) {
    response.render("register", {
        petitionTitle: "Register and sign to save Pop Music",
    });
});

router.post("/register", mw.requireLoggedOut, function (request, response) {
    const { firstname, lastname, email, password } = request.body;
    register(firstname, lastname, email, password)
        .then((result) => {
            if (result) {
                request.session.user_id = result.id;
                response.redirect("/profile");
            }
        })
        .catch((error) => {
            console.log("Error registering", error);
            response.render("register", {
                petitionTitle: "Error registering",
                error,
            });
        });
});

router.get("/profile", mw.requireLoggedIn, function (request, response) {
    response.render("profile", {
        petitionTitle: "Provide us with more details if you dare",
    });
});

router.post("/profile", mw.requireLoggedIn, function (request, response) {
    const { age, city, homepage } = request.body;
    const user_id = request.session.user_id;
    addProfile(user_id, +age, city, homepage).then((result) => {
        response.redirect("/");
    });
});

router.get("/editprofile", mw.requireLoggedIn, function (request, response) {
    const id = request.session.user_id;
    db.getFullUser(id).then((result) => {
        response.render("editprofile", {
            ...result,
            petitionTitle: "Edit your info",
        });
    });
});

router.post("/editprofile", mw.requireLoggedIn, function (request, response) {
    const id = request.session.user_id;
    const { firstname, lastname, email, password, age, city, homepage } =
        request.body;
    Promise.all([
        db.updateUser(id, firstname, lastname, email, password),
        db.upsertProfile(id, age, city, homepage),
    ])
        .then((result) => {
            response.redirect("/editprofile");
        })
        .catch((error) => {
            console.log("Editing error", error);
        });
});

router.get("/delete", mw.requireLoggedIn, function (request, response) {
    response.render("thanks", {
        petitionTitle: "One of us!",
        message: "We will never let you go!",
    });
});

module.exports = router;
