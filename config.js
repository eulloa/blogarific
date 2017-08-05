var config = {}

config.development = {
	database: {
		name: 'blogarific-dev',
		host: 'localhost',
		port: '27017',
		credentials: ''
	},
	application: {
		port: 1337,
		sessionKey: 'kJ283kjFd8722asDf',
		cookieKey: 'Jk830d99dU92hfkQx'
	}
}

config.production = {
	database: {
		name: 'blogarific-prod',
		host: 'localhost',
		port: '8080',
		credentials: ''
	},
	application: {
		port: 80,
		sessionKey: '',
		cookieKey: ''
	}
}

config.environment = 'development'

module.exports = config