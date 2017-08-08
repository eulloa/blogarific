const HomeController = require('./controllers/HomeController')
const LoginController = require('./controllers/LoginController')
const UserController = require('./controllers/UserController')
const Authentication = require('./util/Authentication')
const csurf = require('csurf')
const csurfProtection = csurf()

module.exports = (app) => {
    app.get('/', HomeController.Index)

    //Login
    app.get('/login', csurfProtection, LoginController.Login)
    app.post('/login', LoginController.VerifyLogin)
    app.get('/logout', LoginController.Logout)

    //Users
    app.get('/users/add', csurfProtection, UserController.AddUser)
    app.post('/users/add', UserController.CreateUser)
    app.get('/profile/', Authentication.IsUserLoggedIn, UserController.ShowUserProfile)

    //Posts

    //404
    app.use((req, res, next) => {
        res.pageInfo.notFound = {}
		res.pageInfo.notFound.url = req.originalUrl
        res.status(404).render('error/404', res.pageInfo)
    })
}