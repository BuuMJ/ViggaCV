const CompanyModel = require("../models/Company");
const JobModel = require("../models/Job");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const subVN = require("sub-vn");
const { staffMongoseToObject } = require("../../util/mongoose");

class CompanyProfileController {
  //[GET] Company profile
  async companyprofile(req, res, next) {
    const location = subVN.getProvinces();
    const address = location.map((location) => location.name);
    // console.log(req.user._id);
    const company = await CompanyModel.findOne({ iduser: req.user._id });
    if(company){
      var leadership = company.leadership
    }else{
      var leadership = null
    }
    // console.log(
    //   company.leadership +
    //     "ĐÂY LÀ GIÁ TRỊ CỦA COMPANY PROFILEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE"
    // );
    // const listjob = await JobModel.findone({ iduser: req.user._id });
    // console.log('Đây là leadership ở func [GET] Company profile :' + leadership)
    const listcompany = await CompanyModel.find({});
    const Listcompany = listcompany.map((listcompany) =>
      listcompany.toObject()
    );
    // console.log(listcompany + "DAY LA DANH SACH COMPANY SAU KHI TIM");
    JobModel.find({ iduser: req.user._id }).then((listjob) => {
      listjob = listjob.map((listjob) => listjob.toObject());
      // console.log(company + " = ĐÂY LÀ COMPANY SAU KHI TÌM KIẾM");
      res.render("companyprofile", {
        title: "Company",
        user: req.user,
        company: company,
        listcompany: Listcompany,
        listjob,
        address,
        leader: leadership,
        leadership: staffMongoseToObject(leadership),
      });
    });
  }

  //[PUT] edit  company profile
  async apicompanyprofile(req, res, next) {
    try {
      console.log("Đã tới đâyyyyyyyyyyyyyyyyyyyyyy");
      const iduser = req.user._id;
      const companyname = req.body.companyName;
      const companyaddress = req.body.companyAddress;
      const companyfield = req.body.companyField;
      const taxcode = req.body.taxCode;
      const companyemail = req.body.companyEmail;
      const companyphone = req.body.companyPhone;
      const companyyears = req.body.companyYears;
      const companydesc = req.body.companyDesc;
      const noofemployee = req.body.noofemployee;
      const servicedesc = req.body.serviceDesc;
      const establisheddate = req.body.establisheddate;
      const mission = req.body.mission;
      const history = req.body.history;
      if (req.body.typeOfBusiness === "Choose Type Of Your Business") {
        var typeofbusiness = null;
      } else {
        var typeofbusiness = req.body.typeOfBusiness;
      }
      // console.log(iduser + " đây là những gì bạn nhập vào!!!!!!!");
      // console.log(companyname + " đây là những gì bạn nhập vào!!!!!!!");
      // console.log(companyaddress + " đây là những gì bạn nhập vào!!!!!!!");
      // console.log(companyfield + " đây là những gì bạn nhập vào!!!!!!!");
      // console.log(taxcode + " đây là những gì bạn nhập vào!!!!!!!");
      // console.log(companyemail + " đây là những gì bạn nhập vào!!!!!!!");
      // console.log(companyphone + " đây là những gì bạn nhập vào!!!!!!!");
      // console.log(companyyears + " đây là những gì bạn nhập vào!!!!!!!");
      // console.log(typeofbusiness + " đây là những gì bạn nhập vào!!!!!!!");
      // console.log(companydesc + " đây là những gì bạn nhập vào!!!!!!!");
      if (req.files) {
        const avatar = req.files["avatar"]
          ? req.files["avatar"][0].filename
          : undefined;
        const background = req.files["background"]
          ? req.files["background"][0].filename
          : undefined;
        console.log(
          "ĐÃ CÓ FILE: " + avatar + "CÒN ĐÂY LÀ BACKGROUND: " + background
        );
        if (avatar || background) {
          const company = await CompanyModel.findOne({ iduser: req.user._id });
          if (!company) {
            if (avatar && background) {
              console.log(
                "ĐÃ CÓ AVATAR VÀ BACKGROUND: " +
                  req.files.avatar +
                  req.files.background
              );

              await CompanyModel.create({
                iduser: iduser,
                companyname: companyname,
                companyaddress: companyaddress,
                companyfield: companyfield,
                taxcode: taxcode,
                companyemail: companyemail,
                companyphone: companyphone,
                companyyears: companyyears,
                typeofbusiness: typeofbusiness,
                avatar: avatar,
                background: background,
                companydesc: companydesc,
                noofemployee: noofemployee,
                servicedesc: servicedesc,
                establisheddate: establisheddate,
                mission: mission,
                history: history,
              });
              res.redirect("/companyprofile");
            }
            if (avatar) {
              console.log("ĐÃ CÓ AVATAR: " + req.file.avatar);

              await CompanyModel.create({
                iduser: iduser,
                companyname: companyname,
                companyaddress: companyaddress,
                companyfield: companyfield,
                taxcode: taxcode,
                companyemail: companyemail,
                companyphone: companyphone,
                companyyears: companyyears,
                typeofbusiness: typeofbusiness,
                avatar: avatar,
                companydesc: companydesc,
                noofemployee: noofemployee,
                servicedesc: servicedesc,
                establisheddate: establisheddate,
                mission: mission,
                history: history,
              });
              res.redirect("/companyprofile");
            }

            if (background) {
              console.log("ĐÃ CÓ BACKGROUND: " + req.files.background);

              await CompanyModel.create({
                iduser: iduser,
                companyname: companyname,
                companyaddress: companyaddress,
                companyfield: companyfield,
                taxcode: taxcode,
                companyemail: companyemail,
                companyphone: companyphone,
                companyyears: companyyears,
                typeofbusiness: typeofbusiness,
                background: background,
                companydesc: companydesc,
                noofemployee: noofemployee,
                servicedesc: servicedesc,
                establisheddate: establisheddate,
                mission: mission,
                history: history,
              });
              res.redirect("/companyprofile");
            }
            // res.redirect("/companyprofile");
            // await CompanyModel.create({
            //   iduser: iduser,
            //   companyname: companyname,
            //   companyaddress: companyaddress,
            //   companyfield: companyfield,
            //   taxcode: taxcode,
            //   companyemail: companyemail,
            //   companyphone: companyphone,
            //   companyyears: companyyears,
            //   typeofbusiness: typeofbusiness,
            //   companydesc: companydesc,
            // }).save();
            // res.redirect("/companyprofile");
          } else {
            const idCompany = company._id;
            if (avatar && background) {
              console.log(
                "ĐÃ CÓ AVATAR VÀ BACKGROUND: " +
                  req.files.avatar +
                  req.files.background
              );
              await CompanyModel.findByIdAndUpdate(
                idCompany,
                {
                  iduser: iduser,
                  companyname: companyname,
                  companyaddress: companyaddress,
                  companyfield: companyfield,
                  taxcode: taxcode,
                  companyemail: companyemail,
                  companyphone: companyphone,
                  companyyears: companyyears,
                  typeofbusiness: typeofbusiness,
                  avatar: avatar,
                  background: background,
                  companydesc: companydesc,
                  noofemployee: noofemployee,
                  servicedesc: servicedesc,
                  establisheddate: establisheddate,
                  history: history,
                  mission: mission,
                },
                { new: true }
              );
              res.redirect("/companyprofile");
            }
            if (avatar) {
              console.log("ĐÃ CÓ AVATAR: " + req.files.avatar);
              await CompanyModel.findByIdAndUpdate(
                idCompany,
                {
                  iduser: iduser,
                  companyname: companyname,
                  companyaddress: companyaddress,
                  companyfield: companyfield,
                  taxcode: taxcode,
                  companyemail: companyemail,
                  companyphone: companyphone,
                  companyyears: companyyears,
                  typeofbusiness: typeofbusiness,
                  avatar: avatar,
                  companydesc: companydesc,
                  noofemployee: noofemployee,
                  servicedesc: servicedesc,
                  establisheddate: establisheddate,
                  mission: mission,
                  history: history,
                },
                { new: true }
              );
              res.redirect("/companyprofile");
            }
            if (background) {
              console.log("ĐÃ CÓ BACKGROUND: " + req.files.background);

              await CompanyModel.findByIdAndUpdate(
                idCompany,
                {
                  iduser: iduser,
                  companyname: companyname,
                  companyaddress: companyaddress,
                  companyfield: companyfield,
                  taxcode: taxcode,
                  companyemail: companyemail,
                  companyphone: companyphone,
                  companyyears: companyyears,
                  typeofbusiness: typeofbusiness,
                  background: background,
                  companydesc: companydesc,
                  noofemployee: noofemployee,
                  servicedesc: servicedesc,
                  establisheddate: establisheddate,
                  mission: mission,
                  history: history,
                },
                { new: true }
              );
              res.redirect("/companyprofile");
            }
            // res.redirect("/companyprofile");
            // await CompanyModel.findByIdAndUpdate(
            //   idCompany,
            //   {
            //     iduser: iduser,
            //     companyname: companyname,
            //     companyaddress: companyaddress,
            //     companyfield: companyfield,
            //     taxcode: taxcode,
            //     companyemail: companyemail,
            //     companyphone: companyphone,
            //     companyyears: companyyears,
            //     typeofbusiness: typeofbusiness,
            //     companydesc: companydesc,
            //   },
            //   { new: true }
            // );
            // res.redirect("/companyprofile");
          }
        } else {
          const company = await CompanyModel.findOne({ iduser: req.user._id });
          if (company) {
            console.log("Đã tới đây không có file nhưng đã có dữ liệu1");
            const idCompany = company._id;
            await CompanyModel.findByIdAndUpdate(
              idCompany,
              {
                iduser: iduser,
                companyname: companyname,
                companyaddress: companyaddress,
                companyfield: companyfield,
                taxcode: taxcode,
                companyemail: companyemail,
                companyphone: companyphone,
                companyyears: companyyears,
                typeofbusiness: typeofbusiness,
                companydesc: companydesc,
                noofemployee: noofemployee,
                servicedesc: servicedesc,
                establisheddate: establisheddate,
                mission: mission,
                history: history,
              },
              { new: true }
            );
            res.redirect("/companyprofile");
          } else {
            console.log("Đã tới đây không có file cũng không có dữ liệu");
            await CompanyModel.create({
              iduser: iduser,
              companyname: companyname,
              companyaddress: companyaddress,
              companyfield: companyfield,
              taxcode: taxcode,
              companyemail: companyemail,
              companyphone: companyphone,
              companyyears: companyyears,
              typeofbusiness: typeofbusiness,
              companydesc: companydesc,
              noofemployee: noofemployee,
              servicedesc: servicedesc,
              establisheddate: establisheddate,
              mission: mission,
              history: history,
            });
            res.redirect("/companyprofile");
          }
        }
      } else {
        console.log("loi khi kiem tra files");
      }
    } catch (err) {
      console.log(err);
    }
  }

  //[POST] leadership
  async leadership(req, res, next) {
    const nameleadership = req.body.nameleadership;
    const position = req.body.position;
    const introduce = req.body.introduce;
    const iduser = req.user._id;
    const company = await CompanyModel.findOne({ iduser: iduser });

    if (req.file) {
      const data = await fs.promises.readFile(req.file.path);
      if (data) {
        company.leadership.push({
          avatar: req.file.filename,
          name: nameleadership,
          position: position,
          introduce: introduce,
        });
        await company.save();
        res.redirect("/companyprofile");
      } else {
        company.leadership.push({
          name: nameleadership,
          position: position,
          introduce: introduce,
        });
        await company.save();
        res.redirect("/companyprofile");
      }
    } else {
      company.leadership.push({
        name: nameleadership,
        position: position,
        introduce: introduce,
      });
      await company.save();
      res.redirect("/companyprofile");
    }
  }

  //[GET] Post Job
  async postjob(req, res, next) {
    const iduser = req.user._id;
    const jobname = req.body.jobname;
    const jobdesc = req.body.jobdesc;
    const jobrequi = req.body.jobrequirement;
    const salary = req.body.salary;
    const joblocation = req.body.joblocation;
    const benefit = req.body.benefit;
    const companyname = await CompanyModel.findOne({ iduser: iduser });

    JobModel.create({
      iduser: iduser,
      benefit: benefit,
      companyname: companyname.companyname,
      jobname: jobname,
      jobdesc: jobdesc,
      salary: salary,
      jobrequi: jobrequi,
      joblocation: joblocation,
      avatar: companyname.avatar,
      idcompany: companyname._id
    });
    res.redirect("/companyprofile");
  }

  //[DELETE] Delete leadership
  async deleteLeadership(req, res, next) {
    const company = await CompanyModel.findOne({ iduser: req.user._id });
    const leadershipId = req.params.id;
    company.leadership.pull({ _id: leadershipId });
    await company.save();
    res.redirect("/companyprofile");
  }

}

module.exports = new CompanyProfileController();
