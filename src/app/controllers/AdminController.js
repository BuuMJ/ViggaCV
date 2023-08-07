const CompanyModel = require("../models/Company")

class AdminController{
    async admin(req, res, next){
        const user = req.user
        const company = await CompanyModel.findOne({iduser: user._id})
        res.render("admin",{
            user: req.user,
        })
    }
}
module.exports = new AdminController()