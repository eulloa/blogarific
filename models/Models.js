const config = require('../config');
const mongoose = require('mongoose');
const connectionString = 'mongodb://' + config[config.environment].database.credentials + config[config.environment].database.host + ':' + config[config.environment].database.port + '/' + config[config.environment].database.name;
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '))

mongoose.connect(connectionString, {
    useMongoClient: true
}).then((db) => {
    console.log('MongoDB connection successful!')
})

let UserSchema = mongoose.Schema({
    password: String,
    email: String,
    followers: [],
    following: []
})

let PostSchema = mongoose.Schema({
    userId: String,
    title: String,
    date:  Date,
    content: String,
    likes: Number,
    likedBy: [String],
    comments: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }
})

let CommentSchema = mongoose.Schema({
    userId: String,
    likes: Number,
    dislikes: Number
})

let UserModel = mongoose.model('User', UserSchema)
let PostModel = mongoose.model('Post', PostSchema)
let CommentModel = mongoose.model('Comment', CommentSchema)

module.exports = {
    UserModel: UserModel,
    PostModel: PostModel,
    CommentModel: CommentModel
}