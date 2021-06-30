const express = require("express");
const mw = require("../middleware");
const db = require("../db");
const router = express.Router();

router.get("/thanks", mw.requireLoggedIn, function (request, response) {
    Promise.all([
        db.getSignature(request.session.user_id),
        db.getNumSupporters(),
    ])
        .then((result) => {
            const signature = result[0];
            const numSupporters = result[1];
            if (signature) {
                request.session.numSupporters = numSupporters;
                response.render("thanks", {
                    petitionTitle: "Thank you for your selfless support!",
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

router.post("/thanks", mw.requireLoggedIn, function (request, response) {
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

router.post("/unsign", mw.requireLoggedIn, function (request, response) {
    const id = request.session.user_id;
    db.deleteSignature(id)
        .then((result) => {
            console.log("deleted signature");
            request.session.signed = "";
            request.session.numSupporters -= 1;
            response.redirect("/thanks");
        })
        .catch((error) => {
            console.log("could not delete signature", error);
        });
});

router.get("/supporters", mw.requireLoggedIn, function (request, response) {
    db.getSupporters()
        .then((supporters) => {
            response.render("supporters", {
                petitionTitle: "All your Souls are belong to us",
                supporters: supporters.rows,
            });
        })
        .catch((error) => {
            console.log("Error getting Participants for supporters", error);
        });
});

router.get(
    "/supporters/:city",
    mw.requireLoggedIn,
    function (request, response) {
        const { city } = request.params;
        db.getSupportersByCity(city).then((supporters) => {
            response.render("supporters", {
                // TODO: SANITIZE CITY
                petitionTitle: "Souls from " + city,
                supporters,
                filter: 1,
            });
        });
    }
);

module.exports = router;
