function checkLoggedIn(request) {
    if (request.session.user_id) {
        return true;
    }
    return false;
}

function requireLoggedIn(request, response, next) {
    if (!checkLoggedIn(request)) {
        response.redirect("/login");
    } else {
        next();
    }
}
function requireLoggedOut(request, response, next) {
    if (checkLoggedIn(request)) {
        response.redirect("/");
    } else {
        next();
    }
}

module.exports = {
    requireLoggedIn,
    requireLoggedOut,
};
