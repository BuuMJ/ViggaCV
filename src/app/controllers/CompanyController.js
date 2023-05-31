const CompanyModel = require("../models/Company");
const JobModel = require("../models/Job");
const ActionModel = require("../models/Action");
const {
  staffMongoseToObject,
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../../util/mongoose");
class CompanyController {
  //[GET] List job
  async company(req, res, next) {
    if (req.user) {
      var user_id = req.user._id;
    }
    const company = await CompanyModel.findOne({ iduser: user_id });
    // const listjob = await JobModel.findone({ iduser: req.user._id });
    const count = await CompanyModel.countDocuments({});
    const listcompany = await CompanyModel.find({});
    const Listcompany = listcompany.map((listcompany) =>
      listcompany.toObject()
    );
    const randomIndex = Math.floor(Math.random() * Listcompany.length);
    const randomCompany = Listcompany[randomIndex];
    JobModel.find({ iduser: user_id }).then((listjob) => {
      listjob = listjob.map((listjob) => listjob.toObject());
      // console.log(company + " = ĐÂY LÀ COMPANY SAU KHI TÌM KIẾM");
      res.render("company", {
        title: "Company",
        user: req.user,
        jobcount: listcompany,
        company: company,
        listcompany: Listcompany,
        listjob,
        randomCompany: randomCompany,
        count: count,
      });
    });
  }

  //[GET] company detail
  async detail(req, res, next) {
    const idcompany = req.params.id;
    const company = await CompanyModel.findOne({ _id: idcompany });
    const leadership = company.leadership;
    const checkfl = await ActionModel.findOne({
      companyid: idcompany,
      userid: req.user._id,
      follow: "following",
    });
    JobModel.find({ iduser: company.iduser }).then((listjob) => {
      listjob = listjob.map((listjob) => listjob.toObject());
      res.render("companydetail", {
        title: "Company Detail",
        user: req.user,
        checkfl,
        company: staffMongoseToObject(company),
        leadership: staffMongoseToObject(company.leadership),
        listjob: listjob,
      });
    });
  }

  //[POST] Follow company
  async follow(req, res, next) {
    const idCompany = req.params.id;
    const company = await CompanyModel.findById(idCompany);

    const checkfl = await ActionModel.findOne({
      companyid: idCompany,
      userid: req.user._id,
      follow: "following",
    });
    if (checkfl) {
      await ActionModel.findByIdAndRemove(checkfl._id);
      company.follow--;
      await company.save();
      res.redirect("/company/" + idCompany);
      console.log("ĐÃ XOÁ FOLLOW");
    } else {
      const action = new ActionModel({
        companyid: idCompany,
        userid: req.user._id,
        follow: "following",
      });
      await action.save();
      company.follow++;
      await company.save();
      res.redirect("/company/" + idCompany);
      console.log("ĐÃ THÊM FOLLOW" + checkfl);
    }
  }

  async information(req, res, next) {
    const idcompany = req.params.id;
    // console.log("day la gia tri của: " + idcompany.id)
    const company = await CompanyModel.findOne({ _id: idcompany });
    // const iduser = company.user;
    // const list = await JobModel.find({iduser: iduser})
    // const listjob = list.map((list) => list.toObject());
    // res.render("companyinformation", {
    //   title: "Company Information",
    //   user: req.user,
    //   company,
    //   listjob: listjob,
    // });
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