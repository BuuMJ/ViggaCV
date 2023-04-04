const CompanyModel = require("../models/Company");
const JobModel = require("../models/Job");
const { staffMongoseToObject } = require("../../util/mongoose");
class CompanyController {
  //[GET]
  async company(req, res, next) {
    const company = await CompanyModel.findOne({ iduser: req.user._id });
    // const listjob = await JobModel.findone({ iduser: req.user._id });
    const count = await CompanyModel.countDocuments({});
    const listcompany = await CompanyModel.find({});
    const Listcompany = listcompany.map((listcompany) =>
      listcompany.toObject()
    );
    JobModel.find({ iduser: req.user._id }).then((listjob) => {
      listjob = listjob.map((listjob) => listjob.toObject());
      // console.log(company + " = ĐÂY LÀ COMPANY SAU KHI TÌM KIẾM");
      res.render("company", {
        title: "Company",
        user: req.user,
        company: company,
        listcompany: Listcompany,
        listjob,
        count: count,
      });
    });
  }

  async information(req, res, next) {
    const idcompany = req.params.id;
    const company = await CompanyModel.findOne({ _id: idcompany });
    JobModel.find({ iduser: company.iduser }).then((listjob) => {
      listjob = listjob.map((listjob) => listjob.toObject());
      res.render("companyinformation", {
        title: "Company Information",
        user: req.user,
        company: staffMongoseToObject(company),
        listjob: listjob,
      });
    });
  }
}

module.exports = new CompanyController();
