exports.Index = (req, res) => {
    res.pageInfo.title = 'Blogarific'
    res.render('home/index', res.pageInfo)
}