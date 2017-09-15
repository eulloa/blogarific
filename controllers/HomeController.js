const Model = require('../models/Models');

exports.Index = (req, res) => {
    res.pageInfo.title = 'Blogarific';
    
    let numberOfPosts = 5;
    Model.PostModel.find({}).sort({'date': 'desc'}).limit(numberOfPosts).exec((error, latest) => {
        if (error) {
            return Validation.FlashRedirect(req, res, '/', 'error', Notifications.GetNotification('error', 'postsNotFound'));
        } else {
            res.pageInfo.latestPosts = latest;

            Model.PostModel.find({}).sort({'likes': 'desc'}).limit(numberOfPosts).exec((error, mostPopular) => {
                if (error) {
                    return Validation.FlashRedirect(req, res, '/', 'error', Notifications.GetNotification('error', 'postsNotFound'));
                } else {
                    res.pageInfo.mostPopularPosts = mostPopular;
                    res.render('home/index', res.pageInfo);
                }
            });
        }
    });
}