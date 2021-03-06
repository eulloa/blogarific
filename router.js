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
    app.get('/users/all', UserController.ShowAllUsers)
    app.post('/users/follow/:id', Authentication.IsUserLoggedIn, UserController.FollowUser)
    app.post('/users/unfollow/:id', Authentication.IsUserLoggedIn, UserController.UnfollowUser)
    app.get('/profile/', Authentication.IsUserLoggedIn, UserController.ShowUserProfile)

    //Posts
    app.get('/feed', Authentication.IsUserLoggedIn, PostController.ViewFeedPosts)
    app.get('/posts/single/:id', PostController.ViewSinglePost)
    app.get('/posts/user', Authentication.IsUserLoggedIn, PostController.ViewUserPosts)
    app.post('/posts/new', PostController.CreatePost)
    app.get('/posts/new', Authentication.IsUserLoggedIn, csurfProtection, PostController.AddPost)
    app.get('/posts/delete/:id', Authentication.IsUserLoggedIn, PostController.DeletePost)
    app.get('/posts/edit/:id', Authentication.IsUserLoggedIn, csurfProtection, PostController.EditPost)
    app.post('/posts/edit', Authentication.IsUserLoggedIn, PostController.UpdatePost)
    app.post('/posts/like/:id', Authentication.IsUserLoggedIn, PostController.LikePost)
    app.post('/posts/comment/:id', Authentication.IsUserLoggedIn, PostController.AddComment)

    //404
    app.use((req, res, next) => {
        res.pageInfo.notFound = {}
		res.pageInfo.notFound.url = req.originalUrl
        res.status(404).render('error/404', res.pageInfo)
    })
}