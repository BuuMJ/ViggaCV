const puppeteer = require("puppeteer");
const fs = require("fs");
const pdf = require("html-pdf");
const path = require("path");
const CVModel = require("../models/CV");

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
        cvuser: data,
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

        // // Đợi cho phần tử "form-id" được hiển thị trên trang web trước khi tính kích thước
        // // await webPage.waitForSelector("#form-id");
        // // Xác định phần tử cần in ra
        // const element = await webPage.$("#form-id");
        
        // // Tính kích thước và vị trí của phần tử
        // const boundingBox = await element.boundingBox();
        
        // await webPage.setViewport({ x: boundingBox.x,
        //   y: boundingBox.y,
        //   width: boundingBox.width,
        //   height: boundingBox.height,
        //    deviceScaleFactor: 1});
        // // In ra phần tử với kích thước và vị trí chỉ định
        // await webPage.emulateMediaType("screen");
        // await webPage
        //   .pdf({
        //     path: "output.pdf",
        //     clip: {
        //       x: boundingBox.x,
        //       y: boundingBox.y,
        //       width: boundingBox.width,
        //       height: boundingBox.height,
        //     },
        //   })
          // // Xác định form
          // const form = await webPage.$("#form-id");

          // // Tính kích thước của phần tử form
          // const formBoundingBox = await form.boundingBox();
          // const { x, y, width, height } = formBoundingBox;

          // // Chụp màn hình của phần tử form và xuất ra dưới dạng tệp PDF
          // await webPage.pdf({
          //   path: 'form.pdf',
          //   clip: {
          //     x: formBoundingBox.x,
          //     y: formBoundingBox.y,
          //     width: formBoundingBox.width,
          //     height: formBoundingBox.height
          //   },
          //   margin: {
          //     top: 0,
          //     bottom: 0,
          //     left: 0,
          //     right: 0
          //   }
          // })
          await webPage.pdf({
            printBackground: true,
            displayHeaderFooter: false,
            path: "CV of " + req.user.fullname + ".pdf",
            clip: { x: 100, y: 100, width: 800, height: 600 },
            format: "Tabloid",
            landscape: false,
            margin: {
              top: "10px",
              bottom: "20px",
              left: "10px",
              right: "20px",
            },
          })
          // .then((_) => {
          //   console.log("Tạo file pdf thành công");
          // })
          // .catch((e) => {
          //   console.log(e);
          // });
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
    //-----------------------------------------------------------------------
    //IN RA ĐƯỢC TRANG WEB NHƯNG CHƯA LẤY ĐƯỢC DỮ LIỆU ĐẦU VÀO
    // const browser = await puppeteer.launch();
    // const webPage = await browser.newPage();
    // const url = "http://localhost:3000/cv/createcv";
    // console.log("aaaaaaaaaaaaaaaaaaa " + browser);
    // await webPage.goto(url, {
    //   waitUntil: "networkidle0",
    // });
    // await webPage
    //   .pdf({
    //     printBackground: true,
    //     displayHeaderFooter: false,
    //     path: "testttt.pdf",
    //     format: "A4",
    //     landscape: false,
    //     margin: {
    //       top: "10px",
    //       bottom: "20px",
    //       left: "10px",
    //       right: "20px",
    //     },
    //   })
    //   .then((_) => {
    //     console.log("Tạo file pdf thành công");
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
    // await browser.close();
    //-----------------------------------------------------------------------------------------------------
    //CHỈ IN RA FILE HTML
    // const { filename, name, email, phone } = req.body; // Lấy thông tin từ form
    // console.log(filename, name, email, phone);
    // // Đọc file HTML vào biến html và truyền các giá trị vào
    // let html = fs.readFileSync(
    //   path.join(__dirname, "../../resources/views/createcv.hbs"),
    //   "utf8"
    // );
    // html = html.replace("{name}", name);
    // html = html.replace("{email}", email);
    // html = html.replace("{phone}", phone);
    // // Tạo file PDF và lưu vào thư mục của bạn
    // const options = {
    //   format: "A4",
    //   border: "1cm",
    // };
    // pdf.create(html, options).toFile(`${filename}.pdf`, function (err, _) {
    //   if (err) {
    //     console.log(err);
    //     return res.sendStatus(500);
    //   } else {
    //     console.log("Tạo file PDF thành công");
    //     return res.download(`${filename}.pdf`);
    //   }
    // });
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
