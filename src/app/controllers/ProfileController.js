const nodemailer = require("nodemailer");
const UserModel = require("../models/User");
const multer = require("multer");
const CompanyModel = require("../models/Company");
const upload = multer({ dest: "uploads/" });
const bcrypt = require("bcrypt");
const fs = require("fs");

class ProfileController {
  async profile(req, res, next) {
    const company = await CompanyModel.findOne({ iduser: req.user._id });
    console.log("DAY LA THONG TIN CUA USER: " + req.user.role);
    res.render("profile", {
      title: "Profile User",
      user: req.user,
      company,
    });
  }

  //[PUT] edit profile
  async apiprofile(req, res, next) {
    try {
      console.log("da toi day5");
      const id = req.user.id;
      console.log(id);
      const fullname = req.body.fullname;
      const password = req.body.password;
      const address = req.body.address;
      const city = req.body.city;
      const country = req.body.country;
      const postal = req.body.postal;
      const experience = req.body.experience;
      const education = req.body.education;
      const skills = req.body.skills;
      const certifications = req.body.certifications;
      const languages = req.body.languages;
      const companyname = req.body.companyName;
      const companyaddress = req.body.companyAddress;
      const faxcode = req.body.faxCode;
      const taxcode = req.body.taxCode;
      const companyemail = req.body.companyEmail;
      const phone = req.body.phone;
      const companyyears = req.body.companyYears;
      const companydesc = req.body.companyDesc;
      const TOB = req.body.typeOfBusiness;
      const birthday = req.body.birthday;
      const specialized = req.body.specialized;
      const company = await CompanyModel.findOne({ iduser: req.user._id });

      console.log("da toi day5" + id);
      console.log("da toi day5" + password);
      console.log("da toi day5" + address);
      console.log("da toi day5" + city);
      console.log("da toi day5" + country);
      console.log("da toi day5" + postal);
      console.log("da toi day5" + experience);
      console.log("da toi day5" + education);
      console.log("da toi day5" + skills);
      console.log("da toi day5" + certifications);
      console.log("da toi day5" + languages);
      console.log(fullname);
      console.log(req.file);

      //uploads file
      if (req.file) {
        console.log("đã có file" + password);
        // Kiểm tra xem có file được tải lên không
        const data = await fs.promises.readFile(req.file.path); // sửa chỗ này
        if (data) {
          console.log("đã tới đây và có file");
          if (password) {
            console.log("đã tới đây có file và có password");
            const hash = await bcrypt.hash(password, 10);
            const updateUser = await UserModel.findByIdAndUpdate(
              id,
              {
                address: address,
                specialized: specialized,
                fullname: fullname,
                password: hash,
                city: city,
                country: country,
                postal: postal,
                education: education,
                skills: skills,
                certifications: certifications,
                languages: languages,
                experience: experience,
                avatar: req.file.filename,
                companyname: companyname,
                companyaddress: companyaddress,
                faxcode: faxcode,
                taxcode: taxcode,
                companyemail: companyemail,
                phone: phone,
                companyyears: companyyears,
                companydesc: companydesc,
                TOB: TOB,
                birthday: birthday,
              },
              { new: true }
            );
            res.render("profile", {
              company,
              message: "User updated successfully",
              user: updateUser,
            });
          } else {
            console.log("đã tới đây có file nhưng không có password");
            const updatedUser = await UserModel.findByIdAndUpdate(
              id,
              {
                address: address,
                fullname: fullname,
                city: city,
                country: country,
                postal: postal,
                education: education,
                skills: skills,
                certifications: certifications,
                languages: languages,
                experience: experience,
                avatar: req.file.filename,
                companyname: companyname,
                companyaddress: companyaddress,
                faxcode: faxcode,
                taxcode: taxcode,
                companyemail: companyemail,
                phone: phone,
                companyyears: companyyears,
                companydesc: companydesc,
                TOB: TOB,
                specialized: specialized,
                birthday: birthday,
              },
              { new: true }
            );
            res.render("profile", {
              message: "User updated successfully",
              user: updatedUser,
              company,
            });
          }
        }
      } else {
        console.log("không có file");
        if (password) {
          console.log("đã tới đây không có file nhưng có password");
          const hash = await bcrypt.hash(password, 10);
          const updateUser = await UserModel.findByIdAndUpdate(
            id,
            {
              address: address,
              fullname: fullname,
              password: hash,
              city: city,
              country: country,
              postal: postal,
              education: education,
              skills: skills,
              certifications: certifications,
              languages: languages,
              experience: experience,
              companyname: companyname,
              companyaddress: companyaddress,
              faxcode: faxcode,
              taxcode: taxcode,
              companyemail: companyemail,
              phone: phone,
              companyyears: companyyears,
              companydesc: companydesc,
              TOB: TOB,
              specialized: specialized,
              birthday: birthday,
            },
            { new: true }
          );
          res.render("profile", {
            message: "User updated successfully",
            user: updateUser,
            company,
          });
        } else {
          console.log("đã tới đây khônng có file và không có password");

          const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            {
              address: address,
              fullname: fullname,
              city: city,
              country: country,
              postal: postal,
              education: education,
              skills: skills,
              certifications: certifications,
              languages: languages,
              experience: experience,
              companyname: companyname,
              companyaddress: companyaddress,
              faxcode: faxcode,
              taxcode: taxcode,
              companyemail: companyemail,
              phone: phone,
              companyyears: companyyears,
              companydesc: companydesc,
              TOB: TOB,
              specialized: specialized,
              birthday: birthday,
            },
            { new: true }
          );
          res.render("profile", {
            message: "User updated successfully",
            user: updatedUser,
            company,
          });
        }
      }
    } catch (error) {
      res.status(500).json({ message: "Error updating user", error });
    }
  }

  sendMail(req, res, next) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "duoc6694@gmail.com",
        pass: "wdymtvgbhblstfbj",
      },
    });

    const mailOptions = {
      to: "nxt03091999@gmail.com", // list of receivers
      subject: "test mail", // Subject line
      html: "<h1>this is a test mail.</h1>", // plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) console.log(err);
      else console.log(info);
    });
  }
}
module.exports = new ProfileController();
