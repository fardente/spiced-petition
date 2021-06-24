const express = require("express");
const hb = require("express-handlebars");
// const cookieParser = require("cookie-parser");
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

// app.use(cookieParser());

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
        response.render("petition", {
            petitionTitle: "Welcome to Petition 1",
        });
    } else {
        response.redirect("/login");
    }
});

app.get("/login", function (request, response) {
    console.log("Visiting login");
    if (request.session.loggedin) {
        response.redirect("/");
        return;
    }
    response.render("login", { petitionTitle: "Login to Petition 1" });
});

app.post("/login", function (request, response) {
    console.log("Visiting Post Login");
    console.log(request.body);
    const { email, password } = request.body;
    login(email, password).then((result) => {
        console.log("login result", result);
        if (result) {
            console.log("result true setting cookie");
            request.session.loggedin = "1";
            response.locals.loggedin = "1";
            response.redirect("/");
            return;
        }
        response.redirect("/login");
    });
});

app.post("/logout", function (request, response) {
    console.log("Logged out");
    request.session.loggedin = "";
    response.locals.loggedin = "";
    response.redirect("/");
});

app.get("/register", function (request, response) {
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
    addProfile(user_id, age, city, homepage).then((result) => {
        console.log("at addprofile post", result);
        response.redirect("/");
    });
});

app.get("/thanks", function (request, response) {
    if (request.session.signed) {
        console.log("Cookie is set, getting ID", request.session.signed);
        let id = request.session.signed;
        Promise.all([db.getParticipants(), db.getParticipantById(id)])
            .then((result) => {
                // console.log("get thanks, result", result);
                // console.log(result[1]);
                let signature = result[1].rows[0].signature;
                response.render("thanks", {
                    petitionTitle: "Thanks for signing 1",
                    numSupporters: result[0].rowCount,
                    signature,
                });
            })
            .catch((error) => {
                console.log("Error getting Participants for thanks", error);
            });
    } else {
        response.redirect("/");
    }
});

app.get("/supporters", function (request, response) {
    db.getParticipants()
        .then((result) => {
            console.log(result);
            response.render("supporters", {
                petitionTitle: "Thanks for signing 1",
                supporters: result.rows,
            });
        })
        .catch((error) => {
            console.log("Error getting Participants for supporters", error);
        });
});

app.post("/thanks", function (request, response) {
    let { firstName, lastName, signature } = request.body;
    // console.log("body", firstName, lastName, signature);
    db.addParticipant(firstName, lastName, signature)
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

app.listen(PORT);
