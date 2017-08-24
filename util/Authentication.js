const Validation = require('./Validation')

exports.IsUserLoggedIn = (req, res, next) => {
    if (req.session.userid)
        return next()

    return Validation.FlashRedirect(req, res, '/', 'error', 'You must be logged in to view this page')
}

exports.HasActiveUser = (req, res) => {
    if (req.session.userid)
        return true

    return false
}