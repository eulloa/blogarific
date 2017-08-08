const Validation = require('../util/Validation')
const bcrypt = require('bcrypt-nodejs')
const Model = require('../models/Models')

exports.AddUser = (req, res) => {
    res.pageInfo.title = 'Sign Up'
    res.pageInfo.csrfToken = req.csrfToken()
    res.render('forms/signup', res.pageInfo)
}

exports.CreateUser = (req, res) => {
    let email = req.body.email
    let password = req.body.password
    let password2 = req.body.password2

    if (Validation.IsNullOrEmpty([email, password, password2])) {
        return Validation.ErrorRedirect(res, '/users/add', 'Please enter all information')
    }

    if (!Validation.Equals(password, password2)) {
        return Validation.ErrorRedirect(res, '/users/add', 'Passwords must match')       
    }

    if (!Validation.ValidateEmail(email)) {
        return Validation.ErrorRedirect(res, '/users/add', 'Unrecognized email format')
    }

    Model.UserModel.findOne({ email: email }, (error, result) => {
        if (result) {
            Validation.ErrorRedirect(res, '/users/add', 'This user email already exists...')
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
                    Validation.ErrorRedirect(res, '/forms/signup', 'There was an error creating the user...')
                } else {
                    req.session.userid = u._id
                    req.session.username = u.email
                    res.pageInfo.userInfo = {}
                    res.pageInfo.userInfo.username = u.email
                    Validation.SuccessRedirect(res, '/')
                }
            })
        }
    })
}

exports.ShowUserProfile = (req, res) => {
    res.pageInfo.title = req.session.username
    res.render('user/profile', res.pageInfo)
}