const Validation = require('../util/Validation')
const Notifications = require('../util/Notifications')
const bcrypt = require('bcrypt-nodejs')
const Model = require('../models/Models')

exports.AddUser = (req, res) => {
    res.pageInfo.title = 'Sign Up'
    res.pageInfo.csrfToken = req.csrfToken()
    res.render('user/SignUp', res.pageInfo)
}

exports.CreateUser = (req, res) => {
    let email = req.body.email
    let password = req.body.password
    let password2 = req.body.password2

    if (Validation.IsNullOrEmpty([email, password, password2])) {
        return Validation.FlashRedirect(req, res, '/users/add', 'error', Notifications.GetNotification('error', 'allFieldsRequired'))
    }

    if (!Validation.Equals(password, password2)) {
        return Validation.FlashRedirect(req, res, '/users/add', 'error', Notifications.GetNotification('error', 'passwordMismatch'))
    }

    if (!Validation.ValidateEmail(email)) {
        return Validation.FlashRedirect(req, res, '/users/add', 'error', Notifications.GetNotification('error', 'invalidEmailFormat'))
    }

    Model.UserModel.findOne({ email: email }, (error, result) => {
        if (result) {
            return Validation.FlashRedirect(req, res, '/users/add', 'error', Notifications.GetNotification('error', 'duplicateUser'))
        } else {
            let salt = bcrypt.genSaltSync(10)
            let passwordHash = bcrypt.hashSync(password, salt)

            let u = new Model.UserModel({
                email: email,
                password: passwordHash,
                followers: []
            })

            u.save((error) => {
                if (error) {
                    return Validation.FlashRedirect(req, res, '/users/add', 'error', Notifications.GetNotification('error', 'userNotCreated'))
                } else {
                    req.session.userid = u._id
                    req.session.username = u.email
                    res.pageInfo.userInfo = {}
                    res.pageInfo.userInfo.username = u.email
                    return Validation.FlashRedirect(req, res, '/', 'info', Notifications.GetNotification('success', 'userCreated'))
                }
            })
        }
    })
}

exports.ShowUserProfile = (req, res) => {
    res.pageInfo.title = req.session.username
    res.pageInfo.username = req.session.username
    res.render('user/Profile', res.pageInfo)
}