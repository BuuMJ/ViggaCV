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
      if (req.file) {
        var avatar = req.file.filename;
      } else {
        var avatar = req.body.file;
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
            timeexperience: req.body.timeexperience,
            nameexperience: req.body.nameexperience,
            experience: req.body.experience,
            timeeducation: req.body.timeeducation,
            nameeducation: req.body.nameeducation,
            education: req.body.education,
            maincontent: req.body.maincontent,
            othercontent: req.body.othercontent,
            nameclient: req.body.nameclient,
          },
          {
            new: true,
          }
        ).exec();
      } else {
        const cv = new CVModel(req.body);
        savedCv = await cv.save();
      }
      if (req.body.color) {
        console.log("màu đã được gửi lên");
      } else {
        console.log("màu không được gửi lên");
      }
      console.log(req.body.file);
      console.log(req.body.color);
      console.log(avatar);
      console.log(color);
      console.log(fontfamily);
      console.log(fontsize);
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
        url: "http://localhost:3000/",
      });

      // Navigate to the page you want and create PDF
      await page.goto(
        `http:/localhost:3000/cv/exportcv?color=${color}&fontfamily=${fontfamily}&fontsize=${fontsize}`,
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
