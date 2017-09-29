const Model = require('../models/Models');
const Validation = require('../util/Validation');
const Notifications = require('../util/Notifications');
const AuxController = require('./AuxController')

/**
 * Paginate through all posts
 */
exports.Index = (req, res) => {
    let userId = req.session.username || '';
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
        res.pageInfo.pagination.data = AuxController.CreatePaginationPosts(result.docs, userId); 

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