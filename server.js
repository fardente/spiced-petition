const express = require("express");
const hb = require("express-handlebars");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const path = require("path");
const db = require("./db");
const login = require("./login");
const register = require("./register");
const profile = require("./profile");
const addProfile = require("./profile");
const mw = require("./middleware");

const app = express();
const PORT = 8080;

app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(
    express.urlencoded({
        extended: false,
    })
);

app.use(csurf());

app.use(function (request, response, next) {
    response.set("x-frame-options", "deny");
    response.locals.csrfToken = request.csrfToken();
    response.locals.user_id = request.session.user_id;
    next();
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", mw.requireLoggedIn, function (request, response) {
    db.hasSigned(request.session.user_id).then((result) => {
        if (result) {
            response.redirect("/thanks");
        } else {
            response.render("petition", {
                petitionTitle: "Welcome to Petition 1",
            });
        }
    });
});

app.get("/login", mw.requireLoggedOut, function (request, response) {
    response.render("login", { petitionTitle: "Login to Petition 1" });
});

app.post("/login", mw.requireLoggedOut, function (request, response) {
    const { email, password } = request.body;
    login(email, password).then((user_id) => {
        if (user_id) {
            request.session.user_id = user_id;
            response.redirect("/");
            return;
        }
        response.redirect("/login");
    });
});

app.post("/logout", mw.requireLoggedIn, function (request, response) {
    request.session.user_id = "";
    response.redirect("/");
});

app.get("/register", mw.requireLoggedOut, function (request, response) {
    response.render("register", { petitionTitle: "Register for Petition 1" });
});

app.post("/register", mw.requireLoggedOut, function (request, response) {
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

app.get("/profile", mw.requireLoggedIn, function (request, response) {
    response.render("profile");
});

app.post("/profile", mw.requireLoggedIn, function (request, response) {
    const { age, city, homepage } = request.body;
    const user_id = request.session.user_id;
    addProfile(user_id, +age, city, homepage).then((result) => {
        response.redirect("/");
    });
});

app.get("/thanks", mw.requireLoggedIn, function (request, response) {
    Promise.all([
        db.getSignature(request.session.user_id),
        db.getNumSupporters(),
    ])
        .then((result) => {
            const signature = result[0];
            const numSupporters = result[1];
            if (signature) {
                response.render("thanks", {
                    petitionTitle: "Thanks for signing 1",
                    numSupporters,
                    signature,
                });
            } else {
                response.redirect("/");
            }
        })
        .catch((error) => {
            console.log("Error getting Participants for thanks", error);
        });
});

app.post("/thanks", mw.requireLoggedIn, function (request, response) {
    const { signature } = request.body;
    const user_id = request.session.user_id;
    db.addSignature(user_id, signature)
        .then((id) => {
            request.session.signed = id;
            response.redirect("/thanks");
        })
        .catch((error) => {
            console.log("error post /thanks", error);
            response.render("petition", {
                error: "Error: Could not process your request, please try again later...",
            });
        });
});

app.get("/supporters", mw.requireLoggedIn, function (request, response) {
    db.getSupporters()
        .then((supporters) => {
            response.render("supporters", {
                petitionTitle: "Thanks for signing 1",
                supporters: supporters.rows,
            });
        })
        .catch((error) => {
            console.log("Error getting Participants for supporters", error);
        });
});

app.get("/supporters/:city", mw.requireLoggedIn, function (request, response) {
    const { city } = request.params;
    db.getSupportersByCity(city).then((supporters) => {
        response.render("supporters", {
            petitionTitle: "Supporters from " + city,
            supporters,
            filter: "1",
        });
    });
});

app.get("/editprofile", mw.requireLoggedIn, function (request, response) {
    const id = request.session.user_id;
    db.getFullUser(id).then((result) => {
        response.render("editprofile", result);
    });
});

app.post("/editprofile", mw.requireLoggedIn, function (request, response) {
    const id = request.session.user_id;
    const { firstname, lastname, email, password, age, city, homepage } =
        request.body;
    Promise.all([
        db.updateUser(id, firstname, lastname, email, password),
        db.upsertProfile(id, age, city, homepage),
    ]).then((result) => {
        response.redirect("/editprofile");
    });
});

app.listen(PORT);
