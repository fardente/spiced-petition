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

router.get("/supporters", mw.requireLoggedIn, function (request, response) {
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

router.get(
    "/supporters/:city",
    mw.requireLoggedIn,
    function (request, response) {
        const { city } = request.params;
        db.getSupportersByCity(city).then((supporters) => {
            response.render("supporters", {
                petitionTitle: "Supporters from " + city,
                supporters,
                filter: "1",
            });
        });
    }
);

module.exports = router;
