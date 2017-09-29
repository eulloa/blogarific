const Model = require('../models/Models');
const Validation = require('../util/Validation');
const Notifications = require('../util/Notifications');

/*
**  Paginate through all posts
*/
exports.Index = (req, res) => {
    let limit = 5;
    let page = req.query.page || 1;

    page = page < 1 ? 1 : page;

    let options = {
        sort: { 'date': -1 },
        populate: 'comments',
        lean: true,
        limit: limit,
        page: page
    };

    Model.PostModel.paginate({}, options)
    .then((result) => {
        //if user is logged in, don't let them like a given post more than once
        res.pageInfo.pagination.data = result.docs.map((post) => {
            post.alreadyLiked = false;

            if (this.PostAlreadyLiked(post, req.session.username)) {
                post.alreadyLiked = true;
            }

            return post
        });

        res.pageInfo.title = 'Blogarific';
        res.pageInfo.pagination.shouldShow = result.docs.length ? true : false;
        res.pageInfo.pagination.data.page = result.page;
        res.pageInfo.pagination.data.pages = result.pages;
        res.render('home/Index', res.pageInfo);
    })
    .catch((reject) => {
        return Validation.FlashRedirect(req, res, '/', 'error', Notifications.GetNotification('error', 'postsNotFound'));
    });
}

exports.PostAlreadyLiked = (post, userid) => {
    if (post.likedBy.includes(userid))
        return true

    return false
}