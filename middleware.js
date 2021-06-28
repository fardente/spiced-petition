function checkLoggedIn(request) {
    if (request.session.user_id) {
        return true;
    }
    return false;
}

function requireLoggedIn(request, response, next) {
    if (!checkLoggedIn(request)) {
        response.redirect("/login");
        console.log("not logged in, redirecting");
    } else {
        console.log("loggedin continuing");
        next();
    }
}
function requireLoggedOut(request, response, next) {
    if (checkLoggedIn(request)) {
        response.redirect("/");
        console.log("logged in, redirecting");
    } else {
        console.log("loggedout continuing");
        next();
    }
}

module.exports = {
    requireLoggedIn,
    requireLoggedOut,
};
