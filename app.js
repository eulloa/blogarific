const express = require('express'),
      app = express(),
      session = require('express-session'),
      bcrypt = require('bcrypt-nodejs'),
      bodyParser = require('body-parser'),
      config = require('./config.js'),
      cookieParser = require('cookie-parser'),
      customMiddleware = require('./util/Middleware'),
      errorHandler = require('errorhandler'),
      http = require('http'),
      logger = require('morgan'),
      mongoStore = require('connect-mongo')(session),
      path = require('path')

app.set('port', config[config.environment].application.port)

app.set('views', path.join(__dirname, 'components'))
app.set('view engine', 'jsx')
app.engine('jsx', require('express-react-views').createEngine({
    babel: {
        presets: ['react', 'es2015']
    },
    transformViews: true
}))

app.use(express.static(path.join(__dirname, 'static')))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//Morgan - middleware logger
app.use(logger('dev', { immediate: true }))

//Error handler - dev mode
app.use(errorHandler({ dumpException: true, showStack: true }))

app.use(cookieParser(config[config.environment].application.cookieKey))

app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: config[config.environment].application.sessionKey,
    store: new mongoStore({
        url: 'mongodb://' + config[config.environment].database.host + '/' + config[config.environment].database.name
    })
}))

//Custom Middleware
app.use(customMiddleware.PageInfoSetup)
app.use(customMiddleware.UserInfoSetup)

require('./router')(app)

http.createServer(app).listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'))
})