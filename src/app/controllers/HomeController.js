class HomeController{
    home(req, res, next){
        res.render('home', {
            title: 'Vigga Home',
            user: req.user,
        })
    }
}
module.exports = new HomeController();