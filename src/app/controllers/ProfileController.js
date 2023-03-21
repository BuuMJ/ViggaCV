const nodemailer = require("nodemailer");
const UserModel = require("../../models/User");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const bcrypt = require("bcrypt");
const fs = require("fs");

class ProfileController {
  profile(req, res, next) {
    res.render("profile", {
      title: "Profile User",
      user: req.user,
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
        console.log("da toi day");
        // Kiểm tra xem có file được tải lên không
        const data = await fs.promises.readFile(req.file.path); // sửa chỗ này
        if (data) {
          console.log("da toi day 1");
          if (password != undefined) {
            bcrypt.hash(password, 10, function (err, hash) {
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
                  avatar: req.file.filename,
                },
                { new: true }
              );
              res.render("profile", {
                message: "User updated successfully",
                user: updateUser,
              });
            })
            
          }
        }
      } else {
        console.log("da toi day 2");

        const updatedUser = await UserModel.findByIdAndUpdate(
          id,
          {
            fullname: fullname,
            city: city,
            country: country,
            address: address,
            postal: postal,
            education: education,
            skills: skills,
            certifications: certifications,
            languages: languages,
            experience: experience,
          },
          { new: true }
        );
        res.render("profile", {
          message: "User updated successfully",
          user: updatedUser,
        });
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
