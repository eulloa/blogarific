exports.PageInfoSetup = (req, res, next) => {
    res.pageInfo = {}

    next()
}

exports.UserInfoSetup = (req, res, next) => {
    res.userInfo = {}

    next()
}