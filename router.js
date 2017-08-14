const HomeController = require('./controllers/HomeController')
const LoginController = require('./controllers/LoginController')
const UserController = require('./controllers/UserController')
const PostController = require('./controllers/PostController')
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
    app.get('/posts', PostController.ViewAllPosts)
    app.get('/posts/single/:id', PostController.ViewSinglePost)
    app.get('/posts/view', Authentication.IsUserLoggedIn, PostController.ViewUserPosts)
    app.post('/posts/add', PostController.CreatePost)
    app.get('/posts/add', Authentication.IsUserLoggedIn, PostController.AddPost)

    //404
    app.use((req, res, next) => {
        res.pageInfo.notFound = {}
		res.pageInfo.notFound.url = req.originalUrl
        res.status(404).render('error/404', res.pageInfo)
    })
}