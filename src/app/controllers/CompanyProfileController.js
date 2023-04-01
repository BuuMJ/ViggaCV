const CompanyModel = require("../models/Company");
const JobModel = require("../models/Job");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

class CompanyProfileController {
  //[GET]
  async companyprofile(req, res, next) {
    console.log(req.user._id);
    const company = await CompanyModel.findOne({ iduser: req.user._id });
    console.log(
      company +
        "ĐÂY LÀ GIÁ TRỊ CỦA COMPANY PROFILEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE"
    );
    // const listjob = await JobModel.findone({ iduser: req.user._id });
    const listcompany = await CompanyModel.find({});
    const Listcompany = listcompany.map((listcompany) =>
      listcompany.toObject()
    );
    console.log(listcompany + "DAY LA DANH SACH COMPANY SAU KHI TIM");
    JobModel.find({ iduser: req.user._id }).then((listjob) => {
      listjob = listjob.map((listjob) => listjob.toObject());
      console.log(company + " = ĐÂY LÀ COMPANY SAU KHI TÌM KIẾM");
      res.render("companyprofile", {
        title: "Company",
        user: req.user,
        company: company,
        listcompany: Listcompany,
        listjob,
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
      const typeofbusiness = req.body.typeOfBusiness;
      const companydesc = req.body.companyDesc;

      console.log(iduser + " đây là những gì bạn nhập vào!!!!!!!");
      console.log(companyname + " đây là những gì bạn nhập vào!!!!!!!");
      console.log(companyaddress + " đây là những gì bạn nhập vào!!!!!!!");
      console.log(companyfield + " đây là những gì bạn nhập vào!!!!!!!");
      console.log(taxcode + " đây là những gì bạn nhập vào!!!!!!!");
      console.log(companyemail + " đây là những gì bạn nhập vào!!!!!!!");
      console.log(companyphone + " đây là những gì bạn nhập vào!!!!!!!");
      console.log(companyyears + " đây là những gì bạn nhập vào!!!!!!!");
      console.log(typeofbusiness + " đây là những gì bạn nhập vào!!!!!!!");
      console.log(companydesc + " đây là những gì bạn nhập vào!!!!!!!");
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
              }).save();
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
              }).save();
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
              }).save();
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
            // });f
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
            console.log("Đã tới đây không có file nhưng đã có dữ liệu");
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
            }).save();
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

  //[GET] Post Job
  postjob(req, res, next) {
    const iduser = req.user._id;
    const companyname = req.body.namecompanyjob;
    const jobname = req.body.jobname;
    const jobdesc = req.body.jobdesc;
    const jobrequi = req.body.jobrequi;
    const joblocation = req.body.joblocation;

    JobModel.create({
      iduser: iduser,
      companyname: companyname,
      jobname: jobname,
      jobdesc: jobdesc,
      jobrequi: jobrequi,
      joblocation: joblocation,
    });
    res.redirect("/companyprofile");
  }
}

module.exports = new CompanyProfileController();
