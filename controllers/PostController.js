const Validation = require('../util/Validation')
const Model = require('../models/Models')

exports.ViewAllPosts = (req, res) => {
    Model.PostModel.find({}).exec((error, result) => {
        if (error) {
            return Validation.FlashRedirect(req, res, '/posts', 'error', 'Oops! There was a problem retrieving posts, please try again later...')
        } else {
            res.pageInfo.title = 'Posts'
            res.pageInfo.posts = result
            res.render('posts/ViewAllPosts', res.pageInfo)
        }
    })
}

exports.ViewSinglePost = (req, res) => {
    let id = req.params.id

    Model.PostModel.findOne({ _id: id }, (error, result) => {
        if (error) {
            return Validation.FlashRedirect(req, res, '/', 'error', 'Oops! There was a problem locating that post, please try again...')
        } else {
            if (result) {
                res.pageInfo.title = 'Post - ' + result.title
                res.pageInfo.postTitle = result.title
                res.pageInfo.content = result.content
                res.render('posts/ViewSinglePost', res.pageInfo)
            } else {
                return Validation.FlashRedirect(req, res, '/', 'error', 'Oops! There was a problem locating that post, please try again...')
            }
        }
    })
}

exports.ViewUserPosts = (req, res) => {
    let userid = req.session.userid

    Model.PostModel.find({ userId: userid }, (error, result) => {
        if (error) {
            return Validation.FlashRedirect(req, res, '/posts', 'error', 'Oops! There was an error retrieving your posts, please try again later...')
        } else {
            res.pageInfo.title = 'Posts'
            res.pageInfo.posts = result
            res.render('posts/ViewUserPosts', res.pageInfo)
        }
    })
}

exports.AddPost = (req, res) => {
    res.pageInfo.title = 'Add Post'
    res.render('posts/AddPost', res.pageInfo)
}

exports.CreatePost = (req, res) => {
    let title = req.body.title
    let content = req.body.content

    console.log(req)

    if (Validation.IsNullOrEmpty([title, content])) {
        return Validation.FlashRedirect(req, res, '/posts/add', 'error', 'Oops! Look\'s like you\'re missing some information...')
    }

    let post = new Model.PostModel({
        userId: req.session.userid,
        title: title,
        date: Date.now(),
        content: content,
        likes: 0,
        dislikes: 0,
        comments: null
    })

    post.save((error) => {
        if (error) {
            return Validation.FlashRedirect(req, res, '/posts/add', 'error', 'Sorry! It appears something went wrong... please try creating your post again.')
        } else {
            return Validation.FlashRedirect(req, res, '/posts/single/' + post._id, 'success', 'Post created successfully!')
        }
    })
}