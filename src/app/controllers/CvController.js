const puppeteer = require("puppeteer");
const fs = require("fs");
const pdf = require("html-pdf");
const path = require("path");
const CVModel = require("../models/CV");
const {staffMongoseToObject} = require('../../util/mongoose')

class CvController {
  //[GET] CV
  cv(req, res, next) {
    res.render("cv", {
      title: "NiceCV",
      user: req.user,
    });
  }

  //[GET] Create CV
  async createCV(req, res, next) {
    // const iduser = req.user.id;
    const data = await CVModel.findOne({ iduser: req.user.id });
    // console.log(req.user._id + " = Thông tin của user");
    if (data) {
      // console.log(data + " = Thông tin của user sau khi tra cứu");
      res.render("createCV", {
        title: "Create CV",
        inforCV: staffMongoseToObject(data),
        user: req.user,
      });
      next();
    } else {
      res.render("createCV", {
        title: "Create CV",
        user: req.user,
        usercv: req.user,
      });
    }
  }

  //[GET] CV PDF
  async cvpdf(req, res, next) {
    const iduser = req.params.id;
    const data = await CVModel.findOne({ iduser: iduser });
    console.log("đây là id của user khi thực hiện xuất pdf: " + iduser);
    if (data) {
      // console.log(data + " = Thông tin của user sau khi tra cứu");
      res.render("cvpdf", {
        title: "Export PDF",
        cvuser: data,
        user: req.user,
      });
    } else {
      res.render("cvpdf", {
        title: "Export PDF",
        user: req.user,
        usercv: req.user,
      });
    }
  }

  //[POST] Export CV to PDF
  async exportCV(req, res, next) {
    try {
      req.body.iduser = req.user._id;
      console.log(req.body.iduser);
      const data = await CVModel.findOne({ iduser: req.body.iduser });
      let savedCv;
      if (data) {
        const cv = await CVModel.findByIdAndUpdate(
          data._id,
          {
            fullnamecv: req.body.fullnamecv,
            emailcv: req.body.emailcv,
            phonecv: req.body.phonecv,
            overview: req.body.overview,
            namecompany: req.body.namecompany,
            addrcompany: req.body.addrcompany,
            durationcompany: req.body.durationcompany,
            nameprofession: req.body.nameprofession,
            descprofession: req.body.descprofession,
            nameschool: req.body.nameschool,
            addrschool: req.body.addrschool,
            durationschool: req.body.durationschool,
            nameprofessionschool: req.body.nameprofessionschool,
            descprofessionschool: req.body.descprofessionschool,
            descproject: req.body.descproject,
            nameproject: req.body.nameproject,
            nameskill: req.body.nameskill,
            skilllv1: req.body.skilllv1,
            skilllv2: req.body.skilllv2,
            skilllv3: req.body.skilllv3,
            skilllv4: req.body.skilllv4,
            skilllv5: req.body.skilllv5,
            activities: req.body.activities,
          },
          {
            new: true,
          }
        ).exec();
        const iduser = req.user._id;
        const browser = await puppeteer.launch();
        const webPage = await browser.newPage();
        console.log("ĐÂY LÀ ID CỦA USER NHÌN CHO RÕ VÀO: " + iduser);
        const url = `http://localhost:3000/cv/exportcv/${iduser}`;

        await webPage.goto(url, {
          waitUntil: "networkidle0",
        });

          await webPage.pdf({
            printBackground: true,
            displayHeaderFooter: false,
            path: "CV of " + req.user.fullname + ".pdf",
            clip: { x: 100, y: 100, width: 800, height: 600 },
            format: "Tabloid",
            landscape: false,
            
          })
          .then((_) => {
            console.log("Tạo file pdf thành công");
          })
          .catch((e) => {
            console.log(e);
          });
        await browser.close();
        return res.download("CV of " + req.user.fullname + ".pdf");
      } else {
        const cv = new CVModel(req.body);
        savedCv = await cv.save();
        res.json(savedCv);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Error saving CV");
    }
  }

  //quy
  async exportPDF(req, res, next) {
    try {
      const tuition = await Tuition.find();
      const data = {
        tuition: tuition,
      };
      const filePathName = path.resolve(
        __dirname,
        "../../resources/views/invoice.hbs"
      );
      const htmlString = fs.readFileSync(filePathName).toString();
      let option = {
        format: "Letter",
      };
      const ejsData = ejs.render(htmlString, data);
      // console.log(ejsData);
      pdf.create(ejsData, option).toFile("tuition.pdf", (err, response) => {
        if (err) console.log(err);
        const filePath = path.resolve(__dirname, "../../../tuition.pdf");

        fs.readFile(filePath, (err, file) => {
          if (err) {
            console.log(err);
            return res.status(500).send("could not dowload file");
          }

          res.set("Content-Type", "application/pdf");
          res.set("Content-Disposition", 'attachment;filename="tuition.pdf"');

          res.send(file);
        });
      });
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = new CvController();
