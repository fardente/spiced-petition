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
        secret: process.env.SESSION_SECRET || `I'm always angry.`,
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

app.use(require("./routers/petitionRoutes"));
app.use(require("./routers/userRoutes"));

app.listen(process.env.PORT || PORT);
