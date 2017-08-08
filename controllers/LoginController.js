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
        return Validation.ErrorRedirect(res, '/login', 'Please enter all fields')
    }

    if (!Validation.ValidateEmail(email)) {
        return Validation.ErrorRedirect(res, '/login', 'Unrecognized email format')
    }

    Model.UserModel.findOne({ email: email }, (error, user) => {
        if (error) {
            return Validation.ErrorRedirect(res, '/login', 'There was an error signing in...')
        }
        
        if (user) {
            if (bcrypt.compareSync(password, user.password)) {
                req.session.userid = user._id
                req.session.username = user.email
                res.pageInfo.title = 'Blogarific'
                res.pageInfo.userInfo = {}
                res.pageInfo.userInfo.username = user.email
                console.log(res.pageInfo)
                //TODO: undefined issue with message param in SuccessRedirect
                Validation.SuccessRedirect(res, '/', 'Login successful') 
            } else {
                Validation.ErrorRedirect(res, '/login', 'Your email or password were incorrect, please try loggin in again')
            }
        } else {
            Validation.ErrorRedirect(res, '/login', 'The user was not found in the database')
        }
    })
}

exports.Logout = (req, res) => {
    req.session.destroy()
    Validation.SuccessRedirect(res, '/', 'You have successfully logged out!')
}