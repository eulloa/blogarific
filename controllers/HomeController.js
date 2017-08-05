exports.Index = (req, res) => {
    res.pageInfo.title = 'Blogarific'
    res.render('index', res.pageInfo)
}