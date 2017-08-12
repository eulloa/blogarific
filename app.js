const express = require('express'),
      app = express(),
      session = require('express-session'),
      bcrypt = require('bcrypt-nodejs'),
      bodyParser = require('body-parser'),
      config = require('./config.js'),
      cookieParser = require('cookie-parser'),
      customMiddleware = require('./util/Middleware'),
      errorHandler = require('errorhandler'),
      flash = require('express-flash'),
      handlebars = require('express-handlebars'),
      http = require('http'),
      logger = require('morgan'),
      mongoStore = require('connect-mongo')(session),
      path = require('path')

app.set('port', config[config.environment].application.port)

let hbs = handlebars.create({
    defaultLayout: 'main'
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

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

//Flash messages
app.use(flash())

//Custom Middleware
app.use(customMiddleware.PageInfoSetup)

require('./router')(app)

http.createServer(app).listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'))
})