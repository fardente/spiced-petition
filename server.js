const express = require("express");
const hb = require("express-handlebars");
const cookieSession = require("cookie-session");
const path = require("path");
const db = require("./db");
const login = require("./login");
const register = require("./register");
const profile = require("./profile");
const addProfile = require("./profile");

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

app.use(function (request, response, next) {
    response.locals.loggedin = request.session.loggedin;
    next();
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (request, response) {
    console.log("cookies", request.session);
    if (request.session.loggedin) {
        console.log("Cookie is set, redirecting", response.locals.loggedin);
        db.hasSigned(request.session.user_id).then((result) => {
            if (result) {
                response.redirect("thanks");
            } else {
                response.render("petition", {
                    petitionTitle: "Welcome to Petition 1",
                });
            }
        });
    } else {
        response.redirect("/login");
    }
});

app.get("/login", function (request, response) {
    console.log("Visiting login", request.session.user_id);
    if (request.session.loggedin) {
        response.redirect("/");
        return;
    }
    response.render("login", { petitionTitle: "Login to Petition 1" });
});

app.post("/login", function (request, response) {
    console.log("Visiting Post Login");
    const { email, password } = request.body;
    login(email, password).then((user_id) => {
        console.log("login result", user_id);
        if (user_id) {
            console.log("result true setting cookie");
            request.session.loggedin = "1";
            request.session.user_id = user_id;
            response.redirect("/");
            return;
        }
        response.redirect("/login");
    });
});

app.post("/logout", function (request, response) {
    console.log("Logged out");
    request.session.loggedin = "";
    request.session.user_id = "";
    // response.locals.loggedin = "";
    response.redirect("/");
});

app.get("/register", function (request, response) {
    // TODO: POTENTIAL LOGGED IN CHECK IN MIDDLEWARE
    if (request.session.loggedin) {
        response.redirect("/");
        return;
    }
    response.render("register", { petitionTitle: "Register for Petition 1" });
});

app.post("/register", function (request, response) {
    const { firstname, lastname, email, password } = request.body;
    register(firstname, lastname, email, password).then((result) => {
        console.log("register result", result);
        if (result) {
            console.log("Sucess");
            request.session.loggedin = "1";
            request.session.user_id = result.id;
            response.redirect("/profile");
        }
    });
});

app.get("/profile", function (request, response) {
    console.log("Visiting profile");
    if (!request.session.loggedin) {
        response.redirect("/");
        return;
    }

    response.render("profile");
});

app.post("/profile", function (request, response) {
    console.log("Posting profile");
    const { age, city, homepage } = request.body;
    const user_id = request.session.user_id;
    addProfile(user_id, +age, city, homepage).then((result) => {
        response.redirect("/");
    });
});

app.get("/thanks", function (request, response) {
    if (request.session.loggedin) {
        console.log(request.session.user_id);
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
    } else {
        response.redirect("/");
    }
});

app.post("/thanks", function (request, response) {
    const { signature } = request.body;
    const user_id = request.session.user_id;
    db.addSignature(user_id, signature)
        .then((id) => {
            console.log("post /thanks: res", id);
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

app.get("/supporters", function (request, response) {
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

app.get("/supporters/:city", function (request, response) {
    const { city } = request.params;
    console.log("getting suppoerters from", city);
    db.getSupportersByCity(city).then((supporters) => {
        response.render("supporters", {
            petitionTitle: "Supporters from " + city,
            supporters,
        });
    });
});

app.listen(PORT);
