exports.PageInfoSetup = (req, res, next) => {
    res.pageInfo = {
        title: ''
    }

    if (req.session.userid) {
        res.pageInfo.userInfo = {}
        res.pageInfo.userInfo.username = req.session.username
    }

    next()
}