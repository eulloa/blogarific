const config = require('config');
const mongoose = require('mongoose');
const connectionString = 'mongodb://' + config[config.environment].database.credentials + config[config.environment].database.host + ':' + config[config.environment].database.port + '/' + config[config.environment].database.name;
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '))

mongoose.connect(connectionString, {
    useMongoClient: true
}).then((db) => {
    console.log('MongoDB connection successful!')
})