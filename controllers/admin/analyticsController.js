function analyticsController () {
    return {
        index(req, res) {
            res.render('admin/analytics');
        }
    }
}


module.exports = analyticsController;