const Validation = require('../util/Validation')
const Notifications = require('../util/Notifications')
const Model = require('../models/Models')

exports.ViewAllPosts = (req, res) => {
    Model.PostModel.find({}).exec((error, result) => {
        if (error) {
            return Validation.FlashRedirect(req, res, '/posts', 'error', Notifications.GetNotification('error', 'postsNotFound'))
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
            return Validation.FlashRedirect(req, res, '/', 'error', Notifications.GetNotification('error', 'postNotFound'))
        } else {
            if (result) {
                res.pageInfo.title = 'Post - ' + result.title
                res.pageInfo.postTitle = result.title
                res.pageInfo.content = result.content
                res.render('posts/ViewSinglePost', res.pageInfo)
            } else {
                return Validation.FlashRedirect(req, res, '/', 'error', Notifications.GetNotification('error', 'postNotFound'))
            }
        }
    })
}

exports.ViewUserPosts = (req, res) => {
    let userid = req.session.userid

    Model.PostModel.find({ userId: userid }, (error, result) => {
        if (error) {
            return Validation.FlashRedirect(req, res, '/posts', 'error', Notifications.GetNotification('error', 'userPostsNotFound'))
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

    if (Validation.IsNullOrEmpty([title, content])) {
        return Validation.FlashRedirect(req, res, '/posts/new', 'error', Notifications.GetNotification('error', 'allFieldsRequired'))
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
            return Validation.FlashRedirect(req, res, '/posts/new', 'error', Notifications.GetNotification('error', 'postNotSaved'))
        } else {
            return Validation.FlashRedirect(req, res, '/posts/single/' + post._id, 'success', Notifications.GetNotification('success', 'postCreated'))
        }
    })
}

exports.DeletePost = (req, res) => {
    let id = req.params.id

    Model.PostModel.remove({ _id: id }, (error, result) => {
        if (error) {
            return Validation.FlashRedirect(req, res, '/posts/user', 'error', Notifications.GetNotification('error', 'postNotDeleted'))
        } else {
            return Validation.FlashRedirect(req, res, '/posts/user', 'success', Notifications.GetNotification('success', 'postDeleted'))
        }
    })
}

exports.EditPost = (req, res) => {
    let id = req.params.id

    Model.PostModel.findOne({ _id: id }, (error, result) => {
        if (error) {
            return Validation.FlashRedirect(req, res, '/posts/user', 'error', Notifications.GetNotification('error', 'postNotFound'))
        } else {
            if (result) {
                res.pageInfo.title = 'Edit Post '
                res.pageInfo.post = result
                res.render('posts/EditPost', res.pageInfo)
            } else {
                return Validation.FlashRedirect(req, res, '/posts/user', 'error', Notifications.GetNotification('error', 'postNotFound'))
            }
        }
    })
}

exports.UpdatePost = (req, res) => {
    let title = req.body.title
    let content = req.body.content
    let id = req.body.id

    Model.PostModel.update(
        { _id: id },
        { title: title, content: content },
        (error, result) => {
            if (error) {
                return Validation.FlashRedirect(req, res, '/posts/edit/' + id, 'error', Notifications.GetNotification('error', 'postNotUpdated'))
            } else {
                return Validation.FlashRedirect(req, res, '/posts/user', 'success', Notifications.GetNotification('success', 'postUpdated'))
            }
    })
}