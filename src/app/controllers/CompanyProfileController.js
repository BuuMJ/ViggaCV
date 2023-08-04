const CompanyModel = require("../models/Company");
const JobModel = require("../models/Job");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const subVN = require("sub-vn");
const SubscribeModel = require("../models/Subscribe");
const nodemailer = require("nodemailer");
const ActionModel = require("../models/Action");
const { staffMongoseToObject } = require("../../util/mongoose");
const { subscribe } = require("./HomeController");
const UserModel = require("../models/User");

class CompanyProfileController {
  //[GET] Company profile
  async companyprofile(req, res, next) {
    const location = subVN.getProvinces();
    const address = location.map((location) => location.name);
    // console.log(req.user._id);
    const company = await CompanyModel.findOne({ iduser: req.user._id });
    if (company) {
      var leadership = company.leadership;
    } else {
      var leadership = null;
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
      listjob = listjob.map((job) => job.toJSON());
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
    const position = req.body.position;
    const DoP = req.body.DoP;
    const subscribes = await SubscribeModel.find().distinct("email");
    const companyname = await CompanyModel.findOne({ iduser: iduser });
    const companyfollow = await ActionModel.find({
      companyid: companyname._id,
    }).distinct("userid");
    const listEmail = await UserModel.find({
      _id: { $in: companyfollow },
    }).distinct("email");
    const combinedEmails = subscribes.concat(listEmail);
    console.log(combinedEmails);
    console.log(
      "đây là categories của công ty post jobs: " + companyname.companyfield
    );

    const job = new JobModel({
      iduser: iduser,
      DoP: DoP,
      benefit: benefit,
      companyname: companyname.companyname,
      categories: companyname.companyfield,
      jobname: jobname,
      jobdesc: jobdesc,
      salary: salary,
      jobrequi: jobrequi,
      position: position,
      joblocation: joblocation,
      avatar: companyname.avatar,
      idcompany: companyname._id,
    });
    if (job) {
      if (combinedEmails.length > 0) {
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "duoc6694@gmail.com",
            pass: "wdymtvgbhblstfbj",
          },
        });
        const linkJob = `http://localhost:3000/job/${job._id}`;
        const mailOptions = {
          to: combinedEmails, // list of receivers
          subject: "ViggaCareers ", // Subject line<a href="${linkJob}">here</a>
          html: `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          h1 {
            color: #0066cc;
          }
          .message {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
          }
          .cta-button {
            display: inline-block;
            background-color: #0066cc;
            color: #fff;
            text-decoration: none;
            padding: 10px 15px;
            border-radius: 3px;
          }
          .cta-button:hover {
            background-color: #004c99;
          }
        </style>
      </head>
      <body>
        <h1>ViggaCareers</h1>
        <div class="message">
          <p>Có một việc làm mới đã được đăng bởi công ty ${job.companyname}.</p>
          <p>Vui lòng nhấp vào nút bên dưới để xem công việc mới.</p>
          <p><a href="${linkJob}" class="cta-button">Xem công việc mới</a></p>
        </div>
      </body>
    </html>
  `, // plain text body
        };
        transporter.sendMail(mailOptions, function (err, info) {
          if (err) {
            console.log(err);
          } else {
            console.log("Đã gửi mail cho người đăng kí Jobs");
          }
        });
      }
    }

    const jobJSON = job.toJSON();
    console.log("Đây là ngày giờ sau khi định dạng: " + jobJSON);
    await job.save();
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

  managerCV(req, res, next) {
    res.render("cvManager");
  }

  async deletejob(req, res, next) {
    const jobId = req.params.id;
    await JobModel.findByIdAndDelete(jobId);
    res.redirect("back");
  }
}

module.exports = new CompanyProfileController();
