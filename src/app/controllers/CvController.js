class CvController {
    //[GET] CV
    cv(req, res, next) {
        res.render("cv", {
            title: 'NiceCV',
            user: req.user,
        })
    }

    //[GET] Create CV
    createCV(req, res, next) {
        res.render("createCV", {
            title: 'Create CV',
            user: req.user,
        })
    }
}

module.exports = new CvController();