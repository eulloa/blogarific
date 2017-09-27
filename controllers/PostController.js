const Validation = require('../util/Validation')
const Notifications = require('../util/Notifications')
const Authentication = require('../util/Authentication')
const Model = require('../models/Models')

/*
    Display follower's posts
*/
exports.ViewFeedPosts = (req, res) => {
    let userId = req.session.username;

    Model.UserModel.findOne({ email: userId }).exec((error, user) => {
        if (error) {
            return Validation.FlashRedirect(req, res, '/posts/all', 'error', Notifications.GetNotification('error', 'postsNotFound'));
        } else {
            let userFollowingList = user.following;

            Model.PostModel.find(
                { 
                    userId: { $in: userFollowingList }
                }
            )
            .populate('comments')
            .sort({ date: -1 })
            .exec((error, result) => {
                if (error) {
                    return Validation.FlashRedirect(req, res, '/posts/all', 'error', Notifications.GetNotification('error', 'postsNotFound'));
                }
            })
            .then((followersPosts) => {
                res.pageInfo.posts = Authentication.HasActiveUser(req, res) ? [] : followersPosts
                
                if (!res.pageInfo.posts.length) {
                    //if user is logged in, don't let them like a given post more than once
                    res.pageInfo.posts = followersPosts.map((post) => {
                        post = post.toObject();
                        post.alreadyLiked = false;
    
                        if (this.PostAlreadyLiked(post, req.session.username)) {
                            post.alreadyLiked = true;
                        }
    
                        return post
                    });
                }

                res.pageInfo.title = 'Feed';
                res.render('posts/Feed', res.pageInfo);
            });
        }
    });
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
    let userid = req.session.username

    Model.PostModel.find({ userId: userid }, (error, result) => {
        if (error) {
            return Validation.FlashRedirect(req, res, '/posts', 'error', Notifications.GetNotification('error', 'userPostsNotFound'))
        } else {
            res.pageInfo.title = 'My Posts'
            res.pageInfo.posts = result
            res.render('posts/ViewUserPosts', res.pageInfo)
        }
    })
}

exports.AddPost = (req, res) => {
    res.pageInfo.title = 'Add Post';
    res.pageInfo.csrfToken = req.csrfToken();
    res.render('posts/AddPost', res.pageInfo);
}

exports.CreatePost = (req, res) => {
    let title = req.sanitize(req.body.title)
    let content = req.sanitize(req.body.content)

    if (Validation.IsNullOrEmpty([title, content])) {
        return Validation.FlashRedirect(req, res, '/posts/new', 'error', Notifications.GetNotification('error', 'allFieldsRequired'))
    }

    let post = new Model.PostModel({
        userId: req.session.username,
        title: title,
        date: new Date(),
        content: content,
        likes: 0,
        comments: [],
        likedBy: []
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
                res.pageInfo.title = 'Edit Post';
                res.pageInfo.post = result;
                res.pageInfo.csrfToken = req.csrfToken();
                res.render('posts/EditPost', res.pageInfo);
            } else {
                return Validation.FlashRedirect(req, res, '/posts/user', 'error', Notifications.GetNotification('error', 'postNotFound'))
            }
        }
    })
}

exports.UpdatePost = (req, res) => {
    let title = req.sanitize(req.body.title)
    let content = req.sanitize(req.body.content)
    let id = req.sanitize(req.body.id)

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

exports.LikePost = (req, res) => {
    let postId = req.params.id
    let userid = req.session.username

    Model.PostModel.findByIdAndUpdate(
        { _id: postId },
        {
            $inc: { likes: 1 },
            $push: { likedBy: userid }
        },
        { new: true },
        (error, result) => {
            if (error) {
                return Validation.FlashRedirect(req, res, '/posts/all', 'error', Notifications.GetNotification('error', 'postLikeError'))
            } else {
                res.status(200).json(result.likes)
            }
        }
    )
}

exports.PostAlreadyLiked = (post, userid) => {
    if (post.likedBy.indexOf(userid) !== -1)
        return true

    return false
}

exports.AddComment = (req, res) => {
    let commentBody = req.body.comment;
    let postid = req.params.id;

    if (Validation.IsNullOrEmpty(commentBody)) {
        return Validation.FlashRedirect(req, res, '/posts/all', 'error', Notifications.GetNotification('error', 'emptyComment'));
    }

    let newComment = new Model.CommentModel({
        userId: req.session.username,
        comment: commentBody,
        date: new Date()
    });

    newComment.save((error) => {
        if (error) {
            res.send(400, 'Error saving comment, try again later.');
        }
    }).then((comment) => {
        Model.PostModel.findByIdAndUpdate(
            postid,
            {
                $push: { comments: newComment }
            },
            { new: true },
            (error, result) => {
                if (error) {
                    return Validation.FlashRedirect(req, res, '/posts/all', 'error', Notifications.GetNotification('error', 'commentError'));
                } else {
                    res.status(200).json(newComment);
                }
            }
        );
    })
}

// exports.ViewAllPosts = (req, res, next) => {
//     Model.PostModel.find({}).populate('comments').exec((error, result) => {
//         if (error) {
//             return Validation.FlashRedirect(req, res, '/posts', 'error', Notifications.GetNotification('error', 'postsNotFound'))
//         } else {
//             res.pageInfo.title = 'Posts'
//             res.pageInfo.posts = Authentication.HasActiveUser(req, res, next) ? [] : result

//             if (!res.pageInfo.posts.length) {
//                 //if user is logged in, don't let them like a given post more than once
//                 res.pageInfo.posts = result.map((post) => {
//                     post = post.toObject()
//                     post.alreadyLiked = false

//                     if (this.PostAlreadyLiked(post, req.session.username)) {
//                         post.alreadyLiked = true
//                     }

//                     return post
//                 })
//             }

//             res.render('posts/ViewAllPosts', res.pageInfo)
//         }
//     })
// }