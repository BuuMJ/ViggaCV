class PayrollController{
    payroll(req, res, next){
        res.render("payroll")
    }
}
module.exports = new PayrollController()