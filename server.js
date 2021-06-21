const { response } = require("express");
const express = require("express");
const hb = require("express-handlebars");
const path = require("path");
const db = require("./db");

const app = express();
const PORT = 8080;
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(
    express.urlencoded({
        extended: false,
    })
);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (request, response) {
    response.render("petition", {
        petitionTitle: "Welcome to Petition 1",
    });
});

app.get("/thanks", function (request, response) {
    db.getParticipants().then((result) => {
        response.render("thanks", {
            petitionTitle: "Thanks for signing 1",
            numSupporters: result.rowCount,
        });
    });
});

app.get("/supporters", function (request, response) {
    db.getParticipants().then((result) => {
        response.render("petition", {
            petitionTitle: "Thanks for signing 1",
        });
    });
});

app.post("/thanks", function (request, response) {
    // console.log(request.body);
    let { firstName, lastName, signature } = request.body;
    // console.log("body", firstName, lastName, signature);
    db.addParticipant(firstName, lastName, signature);
    response.render("thanks");
});

// console.log(
//     "he",
//     db.getParticipants().then((result) => console.log(result))
// );

app.listen(PORT);
