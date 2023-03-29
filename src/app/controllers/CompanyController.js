const CompanyModel = require('../models/Company');
const JobModel = require('../models/Job')

class CompanyController {
  //[GET]
  async company(req, res, next) {
    const company = await CompanyModel.findOne({ iduser: req.user._id });
    // const listjob = await JobModel.findone({ iduser: req.user._id });
    const count = await CompanyModel.countDocuments({})
    const listcompany = await CompanyModel.find({})
    const Listcompany = listcompany.map((listcompany) => listcompany.toObject());
    console.log(count + 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa DAY LA SO LUONG DANH SACH COMPANY SAU KHI TIM')
    JobModel.find({}).then((listjob) => {
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
  postjob(req, res, next) {
    res.render("postjob", {
      title: "Post a job",
      user: req.user,
    });
  }
}

module.exports = new CompanyController();
