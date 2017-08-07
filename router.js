const HomeController = require('./controllers/HomeController')

module.exports = (app) => {
    app.get('/', HomeController.Index)

    //404
    app.use((req, res, next) => {
        res.pageInfo.notFound = {}
		res.pageInfo.notFound.url = req.originalUrl
        res.status(404).render('error/404', res.pageInfo)
    })
}