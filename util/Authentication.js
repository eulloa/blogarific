const Validation = require('./Validation')

exports.IsUserLoggedIn = (req, res, next) => {
    if (req.session.userid)
        return next()

    return Validation.FlashRedirect(req, res, '/', 'error', 'You must be logged in to view this page')
}

//TODO: 
    //add a real IsUserLoggedIn function - the one above should return a boolean value instead of redirecting
    //since we don't necessarily want to redirect every single time