exports.PageInfoSetup = (req, res, next) => {
    res.pageInfo = {
        title: '',
        userInfo: {
            username: null,
            userid: null
        }
    }

    next()
}