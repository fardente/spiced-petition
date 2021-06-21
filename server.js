const express = require("express");
const hb = require("express-handlebars");
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require("./db");

const app = express();
const PORT = 8080;

app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(cookieParser());

app.use(
    express.urlencoded({
        extended: false,
    })
);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (request, response) {
    console.log("cookies", request.cookies);
    if (request.cookies.signed) {
        console.log("Cookie set, redirecting");
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
            console.log("Error getting Participants", error);
        });
});

app.get("/supporters", function (request, response) {
    db.getParticipants()
        .then((result) => {
            response.render("petition", {
                petitionTitle: "Thanks for signing 1",
            });
        })
        .catch((error) => {
            console.log("Error getting Participants", error);
        });
});

app.post("/thanks", function (request, response) {
    let { firstName, lastName, signature } = request.body;
    // console.log("body", firstName, lastName, signature);
    db.addParticipant(firstName, lastName, signature)
        .then((result) => {
            console.log("res", result, typeof result.rowCount);
            if (result.rowCount > 0) {
                response.cookie("signed", "true");
                response.render("thanks");
            }
        })
        .catch((error) => {
            response.render("petition", { error });
        });
});

app.listen(PORT);
