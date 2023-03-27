const CompanyModel = require("../models/Company");

class CompanyProfileController {
    //[GET]
    companyprofile(req, res, next) {
        res.render("companyprofile", {
          title: "Company",
          user: req.user,
        });
      }

      //[PUT] edit  company profile
      async apicompanyprofile(req, res, next) {
        try {
          const companyname = req.body.companyname;
          const companyaddress = req.body.companyaddress;
          const faxcode = req.body.faxcode;
          const taxcode = req.body.taxcode;
          const companyemail = req.body.companyemail;
          const companyphone = req.body.companyphone;
          const companyyears = req.body.companyyears;
          const typeofbusiness = req.body.typeofbusiness;
          const companydesc = req.body.companydesc;

          if(req.file) {
            const data = await fs.promises.readFile(req.file.path);
            if (data) {
            }
          }
        }catch(err) {
          
        }
      } 

}

module.exports= new CompanyProfileController();