const CompanyModel = require("../models/Company");

class CompanyProfileController {
  //[GET]
  companyprofile(req, res, next) {
    const company = CompanyModel.findOne({iduser: req.user._id});
    res.render("companyprofile", {
      title: "Company",
      user: req.user,
      company: company,
    });
  }

  //[PUT] edit  company profile
  async apicompanyprofile(req, res, next) {
    try {
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

      if (req.file.avatar || req.file.background) {
        const data = await fs.promises.readFile(req.file.path);
        console.log("ĐÃ CÓ FILE: " + data);
        if (data) {
          const company = await CompanyModel.findOne({ iduser: req.user._id });
          if (!company) {
            if (req.file.avatar && req.file.background) {
              console.log(
                "ĐÃ CÓ AVATAR VÀ BACKGROUND: " +
                  req.file.avatar +
                  req.file.background
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
                avatar: req.file.avatar.filename,
                background: req.file.background.filename,
                companydesc: companydesc,
              }).save();
              res.redirect("/companyprofile");
            }
            if (req.file.avatar[0]) {
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
                avatar: req.file.avatar[0].filename,
                companydesc: companydesc,
              }).save();
              res.redirect("/companyprofile");
            }

            if (req.file.background[0]) {
              console.log("ĐÃ CÓ BACKGROUND: " + req.file.background);

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
                background: req.file.background[0].filename,
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
            if (req.file.avatar[0] && req.file.background[0]) {
              console.log(
                "ĐÃ CÓ AVATAR VÀ BACKGROUND: " +
                  req.file.avatar +
                  req.file.background
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
                  avatar: req.file.avatar[0].filename,
                  background: req.file.background[0].filename,
                  companydesc: companydesc,
                },
                { new: true }
              );
              res.redirect("/companyprofile");
            }
            if (req.file.avatar[0]) {
              console.log("ĐÃ CÓ AVATAR: " + req.file.avatar);
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
                  avatar: req.file.avatar[0].filename,
                  companydesc: companydesc,
                },
                { new: true }
              );
              res.redirect("/companyprofile");
            }
            if (req.file.background[0]) {
              console.log("ĐÃ CÓ BACKGROUND: " + req.file.background);

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
                  background: req.file.background[0].filename,
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
    } catch (err) {}
  }
}

module.exports = new CompanyProfileController();
