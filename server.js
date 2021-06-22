const express = require("express");
const hb = require("express-handlebars");
// const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const path = require("path");
const db = require("./db");

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

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (request, response) {
    console.log("cookies", request.session);
    if (request.session.signed) {
        console.log("Cookie is set, redirecting");
        response.redirect("/thanks");
    } else {
        response.render("petition", {
            petitionTitle: "Welcome to Petition 1",
        });
    }
});

app.get("/thanks", function (request, response) {
    db.getParticipants()
        .then((result) => {
            response.render("thanks", {
                petitionTitle: "Thanks for signing 1",
                numSupporters: result.rowCount,
            });
        })
        .catch((error) => {
            console.log("Error getting Participants for thanks", error);
        });
});

app.get("/supporters", function (request, response) {
    db.getParticipants()
        .then((result) => {
            console.log(result);
            response.render("petition", {
                petitionTitle: "Thanks for signing 1",
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
