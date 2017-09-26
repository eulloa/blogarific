const Model = require('../models/Models');
const Validation = require('../util/Validation');
const Notifications = require('../util/Notifications');

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

    Model.PostModel.paginate({}, options).then((results) => {
        res.pageInfo.title = 'Blogarific';
        res.pageInfo.pagination.shouldShow = results.docs.length ? true : false;
        res.pageInfo.pagination.data = results;
        res.render('home/index', res.pageInfo);
    });
}