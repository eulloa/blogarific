const Validation = require('../util/Validation')
const Model = require('../models/Models')
const bcrypt = require('bcrypt-nodejs')

exports.Login = (req, res) => {
    res.pageInfo.title = 'Login'
    res.pageInfo.csrfToken = req.csrfToken()
    res.render('forms/login', res.pageInfo)
}

exports.VerifyLogin = (req, res) => {
    let email = req.body.email 
    let password = req.body.password

    if (Validation.IsNullOrEmpty([email, password])) {
        return Validation.FlashRedirect(req, res, '/login', 'error', 'Please enter both your email and password to login')
    }

    if (!Validation.ValidateEmail(email)) {
        return Validation.FlashRedirect(req, res, '/login', 'error', 'Invalid email format')
    }

    Model.UserModel.findOne({ email: email }, (error, user) => {
        if (error) {
            return Validation.FlashRedirect(req, res, '/login', 'error', 'There was an error signing in... please try again')
        }
        
        if (user) {
            if (bcrypt.compareSync(password, user.password)) {
                req.session.userid = user._id
                req.session.username = user.email
                res.pageInfo.title = 'Blogarific'
                Validation.FlashRedirect(req, res, '/', 'info')
            } else {
                Validation.FlashRedirect(req, res, '/login', 'error', 'Incorrect login, please try again')
            }
        } else {
            Validation.FlashRedirect(req, res, '/login', 'error', 'The user was not found in the database')
        }
    })
}

exports.Logout = (req, res) => {
    req.session.destroy()
    res.redirect('/')
}