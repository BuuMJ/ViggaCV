const CompanyModel = require("../models/Company");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

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
      console.log("Đã tới đâyyyyyyyyyyyyyyyyyyyyyy");
      const iduser = req.user._id;
      const companyname = req.body.companyName;
      const companyaddress = req.body.companyAddress;
      const faxcode = req.body.faxCode;
      const taxcode = req.body.taxCode;
      const companyemail = req.body.companyEmail;
      const companyphone = req.body.companyPhone;
      const companyyears = req.body.companyYears;
      const typeofbusiness = req.body.typeOfBusiness;
      const companydesc = req.body.companyDesc;

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
                faxcode: faxcode,
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
                faxcode: faxcode,
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
                faxcode: faxcode,
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
            //   faxcode: faxcode,
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
                  faxcode: faxcode,
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
                  faxcode: faxcode,
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
                  faxcode: faxcode,
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
            //     faxcode: faxcode,
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
          console.log("LỖI KHI ĐỌC FILE TẢI LÊN!");
          res.redirect("/companyprofile");
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
              faxcode: faxcode,
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
            faxcode: faxcode,
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
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new CompanyProfileController();
