const CompanyModel = require("../models/Company");
const JobModel = require("../models/Job");
const ActionModel = require("../models/Action");
const {
  staffMongoseToObject,
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../../util/mongoose");
class CompanyController {
  //[GET] List companies
  async company(req, res, next) {
    if (req.user) {
      var user_id = req.user._id;
    }
    const company = await CompanyModel.findOne({ iduser: user_id });
    const count = await CompanyModel.countDocuments({});
    const listcompany = await CompanyModel.find({});
    const Listcompany = listcompany.map((listcompany) =>
      listcompany.toObject()
    );

    var page = req.query.page;
    var PAGE_SIZE = 6;
    var total = Math.ceil(count / PAGE_SIZE);
    const pages = [];
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }

    const randomIndex = Math.floor(Math.random() * Listcompany.length);
    const randomCompany = Listcompany[randomIndex];
    JobModel.find({ iduser: user_id, active: true }).then((listjob) => {
      listjob = listjob.map((listjob) => listjob.toObject());
      console.log(pages);
      if (page) {
        page = parseInt(page);
        const skip = (page - 1) * PAGE_SIZE;
        CompanyModel.find({})
          .skip(skip)
          .limit(PAGE_SIZE)
          .then((data) => {
            res.render("company", {
              title: "Company",
              user: req.user,
              pages: pages,
              jobcount: listcompany,
              company: company,
              listcompany: mutipleMongooseToObject(data),
              listjob,
              randomCompany: randomCompany,
              count: count,
            });
          });
      } else {
        page = 1;
        const skip = (page - 1) * PAGE_SIZE;
        CompanyModel.find({})
          .skip(skip)
          .limit(PAGE_SIZE)
          .then((data) => {
            res.render("company", {
              title: "Company",
              user: req.user,
              pages: pages,
              jobcount: listcompany,
              company: company,
              listcompany: mutipleMongooseToObject(data),
              listjob,
              randomCompany: randomCompany,
              count: count,
            });
          });
      }
    });
  }

  async search(req, res, next) {
    if (req.user) {
      var user_id = req.user._id;
    }
    const search = req.query.search;
    const company = await CompanyModel.find({
      companyname: { $regex: search, $options: "i" },
    });
    const count = company.length;
    const listcompany = await CompanyModel.find({
      companyname: { $regex: search, $options: "i" },
    });
    const Listcompany = listcompany.map((listcompany) =>
      listcompany.toObject()
    );

    var page = req.query.page;
    var PAGE_SIZE = 6;
    var total = Math.ceil(count / PAGE_SIZE);
    const pages = [];
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }

    const randomIndex = Math.floor(Math.random() * Listcompany.length);
    const randomCompany = Listcompany[randomIndex];
    JobModel.find({ iduser: user_id, active: true }).then((listjob) => {
      listjob = listjob.map((listjob) => listjob.toObject());
      console.log(pages);
      if (page) {
        page = parseInt(page);
        const skip = (page - 1) * PAGE_SIZE;
        CompanyModel.find({
          companyname: { $regex: search, $options: "i" },
        })
          .skip(skip)
          .limit(PAGE_SIZE)
          .then((data) => {
            res.render("company", {
              title: "Company",
              user: req.user,
              pages: pages,
              jobcount: listcompany,
              company: company,
              listcompany: mutipleMongooseToObject(data),
              listjob,
              randomCompany: randomCompany,
              count: count,
            });
          });
      } else {
        page = 1;
        const skip = (page - 1) * PAGE_SIZE;
        CompanyModel.find({
          companyname: { $regex: search, $options: "i" },
        })
          .skip(skip)
          .limit(PAGE_SIZE)
          .then((data) => {
            res.render("company", {
              title: "Company",
              user: req.user,
              pages: pages,
              jobcount: listcompany,
              company: company,
              listcompany: mutipleMongooseToObject(data),
              listjob,
              randomCompany: randomCompany,
              count: count,
            });
          });
      }
    });
  }

  async categories(req, res, next) {
    if (req.user) {
      var user_id = req.user._id;
    }
    const search = req.query.categories;
    const company = await CompanyModel.find({
      companyfield: { $regex: search, $options: "i" },
    });
    const count = company.length;
    const listcompany = await CompanyModel.find({
      companyfield: { $regex: search, $options: "i" },
    });
    const Listcompany = listcompany.map((listcompany) =>
      listcompany.toObject()
    );

    var page = req.query.page;
    var PAGE_SIZE = 6;
    var total = Math.ceil(count / PAGE_SIZE);
    const pages = [];
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    const avatarCompany = await CompanyModel.findOne({ iduser: user_id });

    const randomIndex = Math.floor(Math.random() * Listcompany.length);
    const randomCompany = Listcompany[randomIndex];
    JobModel.find({ iduser: user_id, active: true }).then((listjob) => {
      listjob = listjob.map((listjob) => listjob.toObject());
      console.log(pages);
      if (page) {
        page = parseInt(page);
        const skip = (page - 1) * PAGE_SIZE;
        CompanyModel.find({
          companyfield: { $regex: search, $options: "i" },
        })
          .skip(skip)
          .limit(PAGE_SIZE)
          .then((data) => {
            res.render("company", {
              title: "Company",
              user: req.user,
              pages: pages,
              jobcount: listcompany,
              company: avatarCompany,
              listcompany: mutipleMongooseToObject(data),
              listjob,
              randomCompany: randomCompany,
              count: count,
            });
          });
      } else {
        page = 1;
        const skip = (page - 1) * PAGE_SIZE;
        CompanyModel.find({
          companyfield: { $regex: search, $options: "i" },
        })
          .skip(skip)
          .limit(PAGE_SIZE)
          .then((data) => {
            res.render("company", {
              title: "Company",
              user: req.user,
              pages: pages,
              jobcount: listcompany,
              company: avatarCompany,
              listcompany: mutipleMongooseToObject(data),
              listjob,
              randomCompany: randomCompany,
              count: count,
            });
          });
      }
    });
  }

  //[GET] company detail
  async detail(req, res, next) {
    const idcompany = req.params.id;
    const company = await CompanyModel.findOne({ _id: idcompany });
    const leadership = company.leadership;
    var checkfl;
    if (req.user) {
      var data = await ActionModel.findOne({
        companyid: idcompany,
        userid: req.user._id,
        follow: "following",
      });
      if (data) {
        checkfl = { follow: "following" };
      } else {
        checkfl = { follow: "follow" };
      }
    } else {
      checkfl = { follow: "follow" };
    }
    console.log(req.user);
    JobModel.find({ iduser: company.iduser, active: true }).then((listjob) => {
      listjob = listjob.map((listjob) => listjob.toObject());
      res.render("companydetail", {
        title: "Company Detail",
        user: req.user,
        checkfl: checkfl,
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
    if (req.user) {
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
    } else {
      res.redirect("/login");
    }
  }

  async information(req, res, next) {
    const idcompany = req.params.id;
    const company = await CompanyModel.findOne({ _id: idcompany });
    var count = await JobModel.countDocuments({
      iduser: company.iduser,
      active: true,
    });
    var page = req.query.page;
    var PAGE_SIZE = 10;
    var total = Math.ceil(count / PAGE_SIZE);
    const pages = [];
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    if (page) {
      page = parseInt(page);
      var skip = (page - 1) * PAGE_SIZE;
      JobModel.find({ iduser: company.iduser, active: true })
        .skip(skip)
        .limit(PAGE_SIZE)
        .then((listjob) => {
          listjob = listjob.map((listjob) => listjob.toObject());
          res.render("companyinformation", {
            title: "Company Information",
            user: req.user,
            company: staffMongoseToObject(company), //cần sửa company để thấy được avatar
            listjob: listjob,
            pages: pages,
          });
        });
    } else {
      page = 1;
      var skip = (page - 1) * PAGE_SIZE;
      JobModel.find({ iduser: company.iduser, active: true })
        .skip(skip)
        .limit(PAGE_SIZE)
        .then((listjob) => {
          listjob = listjob.map((listjob) => listjob.toObject());
          res.render("companyinformation", {
            title: "Company Information",
            user: req.user,
            company: staffMongoseToObject(company), //cần sửa company để thấy được avatar
            listjob: listjob,
            pages: pages,
          });
        });
    }
  }
}

module.exports = new CompanyController();
