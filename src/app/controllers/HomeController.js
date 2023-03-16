class HomeController{
    home(req, res, next){
        res.render('home', {
            title: 'Vigga Home'
        })
    }
}
module.exports = new HomeController();