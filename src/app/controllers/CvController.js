const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const CVModel = require("../models/CV");
const { staffMongoseToObject } = require("../../util/mongoose");
const CompanyModel = require("../models/Company");
require("dotenv").config();

class CvController {
  //[GET] CV
  async cv(req, res, next) {
    const company = await CompanyModel.findOne({ iduser: req._id });
    res.render("cv", {
      company,
      title: "NiceCV",
      user: req.user,
    });
  }

  //[GET] Create CV
  async createCV(req, res, next) {
    try {
      const company = await CompanyModel.findOne({ iduser: req.user._id });
      const data = await CVModel.findOne({ iduser: req.user._id });
      console.log("đã vào trang createCV");
      if (data) {
        console.log("có thông tin của cv");
        res.render("createcv", {
          title: "Create CV",
          inforCV: staffMongoseToObject(data),
          company,
          user: req.user,
        });
      } else {
        console.log("không có thông tin của cv");
        res.render("createcv", {
          title: "Create CV",
          user: req.user,
          company,
          usercv: req.user,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Bị lỗi rồi nha");
    }
  }

  //[GET] CV PDF
  async cvpdf(req, res, next) {
    const company = await CompanyModel.findOne({ iduser: req._id });
    const data = await CVModel.findOne({ iduser: req.user._id });
    const color = req.query.color;
    const fontfamily = req.query.fontfamily;
    const fontsize = req.query.fontsize;
    if (data) {
      // console.log(data + " = Thông tin của user sau khi tra cứu");
      res.render("cvpdf", {
        title: "Export PDF",
        inforCV: staffMongoseToObject(data),
        user: req.user,
        company,
        color,
        fontfamily,
        fontsize,
      });
    } else {
      res.render("cvpdf", {
        title: "Export PDF",
        user: req.user,
        usercv: req.user,
        company,
        color,
        fontfamily,
        fontsize,
      });
    }
  }

  async export(req, res, next) {
    try {
      const user = req.user;
      if (req.file) {
        var avatar = req.file.filename;
      } else {
        var avatar = user.avatar;
      }
      const iduser = req.user._id;
      req.body.iduser = req.user._id;
      const color = req.body.color
        ? encodeURIComponent(req.body.color)
        : encodeURIComponent("#fed200");
      const fontfamily = req.body.fontfamily
        ? encodeURIComponent(req.body.fontfamily)
        : encodeURIComponent("'Arimo', sans-serif");
      const fontsize = req.body.fontsize
        ? encodeURIComponent(req.body.fontsize)
        : encodeURIComponent("16.5px");
      const data = await CVModel.findOne({ iduser: iduser });
      let savedCv;

      if (data) {
        console.log("Đã tới đây");
        const cv = await CVModel.findByIdAndUpdate(
          data._id,
          {
            iduser: req.body.iduser,
            fullname: req.body.fullname,
            specialized: req.body.specialized,
            email: req.body.email,
            avatar: avatar,
            phone: req.body.phone,
            overview: req.body.overview,
            name: req.body.birthday,
            birthday: req.body.address,
            address: req.body.address,
            maincontent: req.body.maincontent,
            othercontent: req.body.othercontent,
            experience: {
              timeexperience: req.body.timeexperience,
              nameexperience: req.body.nameexperience,
              experience: req.body.experience,
            },

            experience1: {
              timeexperience1: req.body.timeexperience1,
              nameexperience1: req.body.nameexperience1,
              experience1: req.body.experience1,
            },

            experience2: {
              timeexperience2: req.body.timeexperience2,
              nameexperience2: req.body.nameexperience2,
              experience2: req.body.experience2,
            },

            experience3: {
              timeexperience3: req.body.timeexperience3,
              nameexperience3: req.body.nameexperience3,
              experience3: req.body.experience3,
            },

            experience4: {
              timeexperience4: req.body.timeexperience4,
              nameexperience4: req.body.nameexperience4,
              experience4: req.body.experience4,
            },
            education: {
              nameeducation: req.body.nameeducation,
              timeeducation: req.body.timeeducation,
              education: req.body.education,
            },
            education1: {
              nameeducation1: req.body.nameeducation1,
              timeeducation1: req.body.timeeducation1,
              education1: req.body.education1,
            },
            education2: {
              nameeducation2: req.body.nameeducation2,
              timeeducation2: req.body.timeeducation2,
              education2: req.body.education2,
            },
            education3: {
              nameeducation3: req.body.nameeducation3,
              timeeducation3: req.body.timeeducation3,
              education3: req.body.education3,
            },
            education4: {
              nameeducation4: req.body.nameeducation4,
              timeeducation4: req.body.timeeducation4,
              education4: req.body.education4,
            },
            project: {
              timeproject: req.body.timeproject,
              nameproject: req.body.nameproject,
              descript_content: req.body.descript_content,
              clientcontent: req.body.clientcontent,
              members_content: req.body.members_content,
              position_content: req.body.position_content,
              respon_content: req.body.respon_content,
            },
            project1: {
              timeproject1: req.body.timeproject1,
              nameproject1: req.body.nameproject1,
              descript_content1: req.body.descript_content1,
              clientcontent1: req.body.clientcontent1,
              members_content1: req.body.members_content1,
              position_content1: req.body.position_content1,
              respon_content1: req.body.respon_content1,
            },
            project2: {
              timeproject2: req.body.timeproject2,
              nameproject2: req.body.nameproject2,
              descript_content2: req.body.descript_content2,
              clientcontent2: req.body.clientcontent2,
              members_content2: req.body.members_content2,
              position_content2: req.body.position_content2,
              respon_content2: req.body.respon_content2,
            },
            project3: {
              timeproject3: req.body.timeproject3,
              nameproject3: req.body.nameproject3,
              descript_content3: req.body.descript_content3,
              clientcontent3: req.body.clientcontent3,
              members_content3: req.body.members_content3,
              position_content3: req.body.position_content3,
              respon_content3: req.body.respon_content3,
            },
            project4: {
              timeproject4: req.body.timeproject4,
              nameproject4: req.body.nameproject4,
              descript_content4: req.body.descript_content4,
              clientcontent4: req.body.clientcontent4,
              members_content4: req.body.members_content4,
              position_content4: req.body.position_content4,
              respon_content4: req.body.respon_content4,
            },
          },
          {
            new: true,
          }
        );
      } else {
        console.log("Đã tới đây1");
        const cv = new CVModel({
          iduser: req.body.iduser,
          fullname: req.body.fullname,
          specialized: req.body.specialized,
          email: req.body.email,
          avatar: avatar,
          phone: req.body.phone,
          overview: req.body.overview,
          name: req.body.birthday,
          birthday: req.body.address,
          address: req.body.address,
          maincontent: req.body.maincontent,
          othercontent: req.body.othercontent,
          experience: {
            timeexperience: req.body.timeexperience,
            nameexperience: req.body.nameexperience,
            experience: req.body.experience,
          },

          experience1: {
            timeexperience1: req.body.timeexperience1,
            nameexperience1: req.body.nameexperience1,
            experience1: req.body.experience1,
          },

          experience2: {
            timeexperience2: req.body.timeexperience2,
            nameexperience2: req.body.nameexperience2,
            experience2: req.body.experience2,
          },

          experience3: {
            timeexperience3: req.body.timeexperience3,
            nameexperience3: req.body.nameexperience3,
            experience3: req.body.experience3,
          },

          experience4: {
            timeexperience4: req.body.timeexperience4,
            nameexperience4: req.body.nameexperience4,
            experience4: req.body.experience4,
          },
          education: {
            nameeducation: req.body.nameeducation,
            timeeducation: req.body.timeeducation,
            education: req.body.education,
          },
          education1: {
            nameeducation1: req.body.nameeducation1,
            timeeducation1: req.body.timeeducation1,
            education1: req.body.education1,
          },
          education2: {
            nameeducation2: req.body.nameeducation2,
            timeeducation2: req.body.timeeducation2,
            education2: req.body.education2,
          },
          education3: {
            nameeducation3: req.body.nameeducation3,
            timeeducation3: req.body.timeeducation3,
            education3: req.body.education3,
          },
          education4: {
            nameeducation4: req.body.nameeducation4,
            timeeducation4: req.body.timeeducation4,
            education4: req.body.education4,
          },
          project: {
            timeproject: req.body.timeproject,
            nameproject: req.body.nameproject,
            descript_content: req.body.descript_content,
            clientcontent: req.body.clientcontent,
            members_content: req.body.members_content,
            position_content: req.body.position_content,
            respon_content: req.body.respon_content,
          },
          project1: {
            timeproject1: req.body.timeproject1,
            nameproject1: req.body.nameproject1,
            descript_content1: req.body.descript_content1,
            clientcontent1: req.body.clientcontent1,
            members_content1: req.body.members_content1,
            position_content1: req.body.position_content1,
            respon_content1: req.body.respon_content1,
          },
          project2: {
            timeproject2: req.body.timeproject2,
            nameproject2: req.body.nameproject2,
            descript_content2: req.body.descript_content2,
            clientcontent2: req.body.clientcontent2,
            members_content2: req.body.members_content2,
            position_content2: req.body.position_content2,
            respon_content2: req.body.respon_content2,
          },
          project3: {
            timeproject3: req.body.timeproject3,
            nameproject3: req.body.nameproject3,
            descript_content3: req.body.descript_content3,
            clientcontent3: req.body.clientcontent3,
            members_content3: req.body.members_content3,
            position_content3: req.body.position_content3,
            respon_content3: req.body.respon_content3,
          },
          project4: {
            timeproject4: req.body.timeproject4,
            nameproject4: req.body.nameproject4,
            descript_content4: req.body.descript_content4,
            clientcontent4: req.body.clientcontent4,
            members_content4: req.body.members_content4,
            position_content4: req.body.position_content4,
            respon_content4: req.body.respon_content4,
          },
        });
        savedCv = await cv.save();
      }

      console.log(req.body.timeproject1);
      console.log(req.body.nameproject1);
      console.log(req.body.descript_content1);
      console.log(req.body.clientcontent1);
      console.log(req.body.members_content1);
      console.log(req.body.position_content1);
      console.log(req.body.respon_content1);

      const token = req.cookies.token;
      // console.log(token);
      const browser = await puppeteer.launch({
        args: [
          "--disable-setuid-sandbox",
          "--no-sandbox",
          "--single-process",
          "--no-zygote",
        ],
        executablePath:
          process.env.NODE_ENV === "production"
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath(),
      });
      const page = await browser.newPage();

      // Set cookie with the token
      await page.setCookie({
        name: "token",
        value: token,
        url: "https://vigga-careers.onrender.com//",
      });

      // Navigate to the page you want and create PDF
      await page.goto(
        `https://vigga-careers.onrender.com/cv/exportcv?color=${color}&fontfamily=${fontfamily}&fontsize=${fontsize}`,
        {
          waitUntil: "networkidle0",
        }
      );
      // Wait until the element appears on the page
      await page.waitForSelector(".body__create-cv.a4");

      await page.addStyleTag({
        content: ".header-app, .footer-app { display: none !important; }",
      });

      await page.addStyleTag({
        content:
          ".header-background, .action-create-cv { display: none !important; }",
      });

      await page.addStyleTag({
        content: ".body__create-cv.a4 { margin-top: 0px; margin-bottom: 0px; }",
      });

      // Get the element you want to print
      const element = await page.$(".body__create-cv.a4"); // Select the element with class "body__create-cv a4"

      // Get information about the bounding box of the element
      const bounding_box = await element.boundingBox();
      console.log(bounding_box.x);
      console.log(bounding_box.y);
      console.log(bounding_box.width);
      console.log(bounding_box.height);

      await page
        .pdf({
          printBackground: true,
          displayHeaderFooter: false,
          landscape: false,
          format: "A4",
          path: "CV of " + req.user.fullname + ".pdf",
          clip: {
            x: bounding_box.x,
            y: bounding_box.y,
            width: bounding_box.width,
            height: bounding_box.height,
          },
        })
        .then((_) => {
          console.log("Tạo file pdf thành công");
        })
        .catch((e) => {
          console.log(e);
        });

      await browser.close();
      res.download("CV of " + req.user.fullname + ".pdf", function (err) {
        if (err) {
          // Handle error, but keep in mind the response may be partially-sent
          // so check res.headersSent
        } else {
          // decrement a download credit, etc.
          fs.unlink("CV of " + req.user.fullname + ".pdf", function (err) {
            if (err) console.log(err);
            console.log("File deleted!");
          });
        }
      });
      // return res.redirect("back");
    } catch (err) {
      console.log("alooooo");
      console.error(err);
      res.status(500).send("Error saving CV");
    }
  }
}

module.exports = new CvController();
