const Validation = require('../util/Validation')
const Notifications = require('../util/Notifications')
const Model = require('../models/Models')
const bcrypt = require('bcrypt-nodejs')

exports.Login = (req, res) => {
    res.pageInfo.title = 'Login'
    res.pageInfo.csrfToken = req.csrfToken()
    res.render('user/Login', res.pageInfo)
}

exports.VerifyLogin = (req, res) => {
    let email = req.body.email 
    let password = req.body.password

    if (Validation.IsNullOrEmpty([email, password])) {
        return Validation.FlashRedirect(req, res, '/login', 'error', Notifications.GetNotification('error', 'allFieldsRequired'))
    }

    if (!Validation.ValidateEmail(email)) {
        return Validation.FlashRedirect(req, res, '/login', 'error', Notifications.GetNotification('error', 'invalidEmailFormat'))
    }

    Model.UserModel.findOne({ email: email }, (error, user) => {
        if (error) {
            return Validation.FlashRedirect(req, res, '/login', 'error', Notifications.GetNotification('error', 'loginError'))
        }
        
        if (user) {
            if (bcrypt.compareSync(password, user.password)) {
                req.session.userid = user._id
                req.session.username = user.email
                res.pageInfo.title = 'Blogarific'
                Validation.FlashRedirect(req, res, '/', 'info')
            } else {
                Validation.FlashRedirect(req, res, '/login', 'error', Notifications.GetNotification('error', 'loginError'))
            }
        } else {
            Validation.FlashRedirect(req, res, '/login', 'error', Notifications.GetNotification('error', 'userNotFound'))
        }
    })
}

exports.Logout = (req, res) => {
    req.session.destroy()
    res.redirect('/')
}